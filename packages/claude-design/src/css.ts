// The multi-brand stylesheet: `@chassis-ui/css` compiled once per brand and merged into one file,
// in which `data-cx-brand` on any element picks the brand of its subtree.
//
// chassis-css has no brand switch of its own. It takes one token set at compile time, through the
// `chassis-tokens` module its `scss/config/_vendor.scss` forwards from the Sass load path, so each
// brand is a full compile with its own `_chassis-tokens.scss` first on that path. The Chassis
// compile is kept whole: it is the default brand, on `:root`. The others are diffed against it:
//
// - The token block, the one unlayered `:root` rule holding every `--cx-*` custom property, is
//   redeclared whole on `[data-cx-brand=<brand>]` for every brand, the default included, so an
//   element of the default brand nested inside another brand's turns back. Whole, not only the
//   changed values: a token declared with `var()` resolves where it is declared, so an unchanged
//   `--cx-x: var(--cx-y)` must be declared again beside the changed `--cx-y`.
// - Every other rule whose declarations differ is one where Sass baked a token value into the
//   output (the `fg-a11y` contrast pairs, the form icons' SVG data URIs, display letter-spacing).
//   Each brand's version is re-emitted in its own cascade layer and media query, under an `@scope`
//   that stops at a nested element of another brand, with `:root` written as `:scope`.
import * as fs from 'fs'
import * as path from 'path'
import { pathToFileURL } from 'url'
import * as sass from 'sass'
import postcss, { type AtRule, type ChildNode, type Container, type Root, type Rule } from 'postcss'
import { transform } from 'esbuild'
import {
  BRANDS,
  CHASSIS_CSS,
  CHASSIS_ICONS,
  DEFAULT_BRAND,
  REACT,
  REACT_MODULES,
  WORK,
  type Brand
} from './paths.ts'

interface Leaf {
  // The at-rules around the rule, outermost first (`@layer utilities`, `@media (...)`).
  context: string[]
  rule: Rule
}

async function compile(brand: Brand): Promise<Root> {
  const tokensDir = path.join(WORK, 'tokens', brand)
  fs.mkdirSync(tokensDir, { recursive: true })
  fs.writeFileSync(
    path.join(tokensDir, '_chassis-tokens.scss'),
    `@forward "@chassis-ui/tokens/dist/web/docs/${brand}/main";\n`
  )
  const { css } = sass.compile(path.join(CHASSIS_CSS, 'scss/chassis.scss'), {
    loadPaths: [tokensDir, REACT_MODULES],
    style: 'expanded',
    quietDeps: true,
    silenceDeprecations: ['import']
  })
  // The `cx-` prefix comes from the framework's own PostCSS preset, as in its own build.
  const preset = await import(pathToFileURL(path.join(CHASSIS_CSS, 'postcss/index.js')).href)
  const result = await postcss(preset.chassisPostcss()).process(css, { from: undefined })
  return result.root
}

function leaves(container: Container, context: string[] = [], out: Leaf[] = []): Leaf[] {
  container.each((node: ChildNode) => {
    if (node.type === 'rule') out.push({ context, rule: node })
    else if (node.type === 'atrule' && node.nodes) {
      leaves(node, [...context, `@${node.name} ${node.params}`], out)
    }
  })
  return out
}

const body = (rule: Rule) => rule.nodes.map((n) => n.toString()).join(';')

function isTokenBlock(leaf: Leaf): boolean {
  return (
    leaf.context.length === 0 &&
    leaf.rule.selector === ':root' &&
    leaf.rule.nodes.some((n) => n.type === 'decl' && n.prop === '--chassis-prefix')
  )
}

// Wraps `rules` in their at-rule chain, innermost last.
function nest(context: string[], rules: ChildNode[]): ChildNode[] {
  let nodes = rules
  for (const at of [...context].reverse()) {
    const [, name, params] = /^@(\S+)\s*(.*)$/.exec(at)!
    const wrapper: AtRule = postcss.atRule({ name, params })
    wrapper.append(nodes)
    nodes = [wrapper]
  }
  return nodes
}

export interface StyleResult {
  css: string
  // The custom properties of each brand's token block: tokens.json reads its values here, and
  // the control check reads the default brand's.
  tokens: Map<Brand, Map<string, string>>
  bakedRules: number
}

export async function buildStyles(): Promise<StyleResult> {
  const roots = new Map<Brand, Root>()
  for (const brand of BRANDS) roots.set(brand, await compile(brand))

  const base = roots.get(DEFAULT_BRAND)!
  const baseLeaves = leaves(base)
  const tokenBlocks = new Map<Brand, Rule>()
  // Per brand, the rules Sass baked differently, by their index in the compile, so each brand's
  // set is emitted in source order and keeps its cascade order.
  const baked = new Map<Brand, Map<number, Leaf>>(BRANDS.map((b) => [b, new Map()]))

  for (const brand of BRANDS) {
    const brandLeaves = leaves(roots.get(brand)!)
    if (brandLeaves.length !== baseLeaves.length) {
      throw new Error(
        `css: the ${brand} compile has ${brandLeaves.length} rules and ${DEFAULT_BRAND} ` +
          `${baseLeaves.length}; the diff needs both to come from the same source in the same order`
      )
    }
    brandLeaves.forEach((leaf, i) => {
      const other = baseLeaves[i]
      if (
        leaf.rule.selector !== other.rule.selector ||
        leaf.context.join() !== other.context.join()
      ) {
        throw new Error(
          `css: rule ${i} is \`${leaf.rule.selector}\` in ${brand} but \`${other.rule.selector}\` in ${DEFAULT_BRAND}`
        )
      }
      if (isTokenBlock(leaf)) tokenBlocks.set(brand, leaf.rule)
      else if (body(leaf.rule) !== body(other.rule)) {
        // Both sides are kept: the default brand's version restores it under a nested element of
        // the default brand. A rule several brands change is one entry, by its index.
        baked.get(brand)!.set(i, leaf)
        if (brand !== DEFAULT_BRAND) baked.get(DEFAULT_BRAND)!.set(i, other)
      }
    })
  }

  const out = base.clone()
  for (const brand of BRANDS) {
    const tokens = tokenBlocks.get(brand)
    if (!tokens) throw new Error(`css: no token block in the ${brand} compile`)
    const block = tokens.clone({ selector: `[data-cx-brand=${brand}]` })
    // Custom properties only. The block's `color-scheme: light dark` would beat
    // `[data-cx-theme=dark]` on the same element (equal specificity, later in the file), and the
    // marker the framework's scripts read stays on `:root`.
    block.each((n) => {
      if (n.type !== 'decl' || !n.prop.startsWith('--') || n.prop === '--chassis-prefix') n.remove()
    })
    out.append(block)
  }
  let bakedRules = 0
  for (const brand of BRANDS) {
    const scoped = [...baked.get(brand)!.entries()]
      .sort(([x], [y]) => x - y)
      .map(([, leaf]) => leaf)
    const byContext = new Map<string, Leaf[]>()
    for (const leaf of scoped) {
      const key = leaf.context.join('\u0000')
      byContext.set(key, [...(byContext.get(key) ?? []), leaf])
    }
    for (const group of byContext.values()) {
      const rules = group.map(({ rule }) =>
        rule.clone({ selector: rule.selector.replace(/:root\b/g, ':scope') })
      )
      bakedRules += rules.length
      const scope = postcss.atRule({
        name: 'scope',
        params: `([data-cx-brand=${brand}]) to ([data-cx-brand]:not([data-cx-brand=${brand}]))`
      })
      scope.append(rules)
      // `@scope` goes inside the layer and media chain, so each rule keeps its cascade layer.
      out.append(nest(group[0].context, [scope]))
    }
  }

  const tokens = new Map<Brand, Map<string, string>>()
  for (const [brand, block] of tokenBlocks) {
    const props = new Map<string, string>()
    block.walkDecls((d) => {
      if (d.prop.startsWith('--')) props.set(d.prop, d.value)
    })
    tokens.set(brand, props)
  }

  // The package's own component CSS and the icon glyph classes, as a consuming app loads them.
  // The icons' own `@font-face`, with its cache-busting url, is left out: tokens.css declares
  // every face, that one included.
  const own = fs.readFileSync(path.join(REACT, 'dist/style.css'), 'utf8')
  const icons = fs
    .readFileSync(path.join(CHASSIS_ICONS, 'icons/chassis-icons.min.css'), 'utf8')
    .replace(/@font-face\{[^}]*\}/g, '')

  const merged = [out.toString(), own, icons].join('\n')
  const { code } = await transform(merged, { loader: 'css', minify: true, legalComments: 'none' })
  return { css: code, tokens, bakedRules }
}

// The control: the Chassis compile made here must match the published stylesheet's token block,
// or the build is not compiling chassis-css the way chassis-css compiles itself.
export function controlCheck(rootProps: Map<string, string>): string[] {
  const published = postcss.parse(
    fs.readFileSync(path.join(CHASSIS_CSS, 'dist/css/chassis.css'), 'utf8')
  )
  const expected = new Map<string, string>()
  published.each((node) => {
    if (node.type === 'rule' && node.selector === ':root' && expected.size === 0) {
      node.walkDecls((d) => {
        if (d.prop.startsWith('--')) expected.set(d.prop, d.value)
      })
    }
  })
  const problems: string[] = []
  for (const [prop, value] of expected) {
    if (!rootProps.has(prop)) problems.push(`missing ${prop}`)
    else if (rootProps.get(prop) !== value)
      problems.push(`${prop}: ${rootProps.get(prop)} ≠ ${value}`)
  }
  for (const prop of rootProps.keys()) if (!expected.has(prop)) problems.push(`extra ${prop}`)
  return problems
}
