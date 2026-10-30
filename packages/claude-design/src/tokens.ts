// tokens.json and tokens.css, from the token blocks the stylesheet build compiled, and the brand
// comparison the README shows.
//
// The values come from the compiled CSS, not from `@chassis-ui/website-tokens`' Sass: that is what
// a component reads, in the names a consumer writes (`--cx-primary-fg-main`). A colour there is
// `light-dark(<light>, <dark>)`, so each brand gives two themes, and the page shows every theme as
// a column of its token views. Token names drop the `cx-` prefix on purpose: the page writes a
// custom property per token into the tokens.css every preview loads, and `--primary` reaches
// nothing in bundle.css, so the swatches can never restyle a component.
import * as fs from 'fs'
import * as path from 'path'
import { BRAND_NAMES, BRANDS, DEFAULT_BRAND, MODES, PROJECT, TITLE, type Brand } from './paths.ts'
import type { FontFace } from './assets.ts'

const CONTEXTS = [
  'default',
  'alternate',
  'primary',
  'secondary',
  'neutral',
  'success',
  'danger',
  'warning',
  'info',
  'black',
  'white'
] as const

// The roles each context shows, with what the swatch's usage note says about it.
const ROLES: Record<string, (ctx: string) => string> = {
  '': (c) =>
    `Solid fill of ${c} components and the \`bg-${c}\` utility. Text on it is \`${c}-contrast\`.`,
  contrast: (c) => `Text and icons on a solid \`${c}\` fill.`,
  'fg-main': (c) =>
    `Text tinted ${c}, on the \`${c}-bg-main\` and default surfaces (\`${c}-fg-main\`).`,
  'fg-subtle': (c) => `Secondary text tinted ${c}, on the \`${c}-bg-main\` surface.`,
  'bg-main': (c) => `Tinted ${c} surface, such as a ${c} alert (\`${c}-bg-main\`).`,
  'bg-evident': (c) => `Stronger tinted ${c} surface, for a hovered or selected ${c} item.`,
  'border-main': (c) => `Border of a tinted ${c} surface (\`${c}-border-main\`).`,
  'border-subtle': (c) => `Hairline border tinted ${c}.`
}
const STEPS = ['05', '10', '20', '30', '40', '50', '60', '70', '80', '90', '95']
// The neutral roles every surface reads, which follow the nearest context.
const ROOT_ROLES: Record<string, string> = {
  'fg-main': 'Body text on the page background.',
  'fg-subtle': 'Secondary text: captions, help text, metadata.',
  'fg-slight': 'Placeholder and disabled text.',
  'bg-main': 'The page background.',
  'bg-even': 'Alternate rows and quiet panels on the page background.',
  'bg-evident': 'Raised or highlighted surfaces on the page background.',
  'border-main': 'Control and card borders.',
  'border-subtle': 'Dividers and hairlines.'
}

// `light-dark(a, b)` → [a, b], splitting on the comma at depth 0.
function lightDark(value: string): [string, string] | undefined {
  const m = /^light-dark\((.*)\)$/.exec(value.trim())
  if (!m) return undefined
  let depth = 0
  for (let i = 0; i < m[1].length; i++) {
    const ch = m[1][i]
    if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (ch === ',' && depth === 0) return [m[1].slice(0, i).trim(), m[1].slice(i + 1).trim()]
  }
  return undefined
}

// A colour the page reads: a colour function with plain numbers, its hue unitless.
function readableColor(value: string): string | undefined {
  if (/\b(from|var|calc|color-mix)\b/.test(value)) return undefined
  if (!/^(oklch|oklab|rgba?|hsla?|#)/.test(value)) return undefined
  return value.replace(/(\d)deg\b/g, '$1')
}

export const themeId = (brand: Brand, mode: string) => `${brand}-${mode}`

// The largest value of a fluid `clamp(min, preferred, max)` size: the specimens show type at its
// largest, and the stylesheet keeps the fluid value.
const largest = (value: string) => /^clamp\(.*,\s*([^,()]+)\)$/.exec(value)?.[1].trim() ?? value

// A token's value with a `var()` of another token resolved through the brand's own block.
const resolver = (t: Map<string, string>) => {
  const value = (prop: string): string => {
    const v = t.get(prop) ?? ''
    const ref = /^var\((--[a-z0-9-]+)\)$/.exec(v)
    return ref ? value(ref[1]) : v
  }
  return value
}

interface Token {
  name: string
  value: string
  usage: string
}
interface TypeStyle {
  name: string
  family: string
  fontSize: string
  lineHeight: string
  fontWeight: number
}
export interface TokensJson {
  name: string
  version: number
  meta: Record<string, string>
  color: {
    themes: { id: string; name: string }[]
    tokens: { name: string; value: Record<string, string> | string; usage: string }[]
  }
  type: {
    fonts: { family: string; style: string; weight: string; file: string }[]
    families: Record<string, string>
    groups: { name: string; family: string; styles: TypeStyle[] }[]
  }
  spacing: { tokens: Token[] }
  radius: { tokens: Token[] }
  shadow: { tokens: Token[] }
}

export function buildTokens(
  tokens: Map<Brand, Map<string, string>>,
  faces: FontFace[],
  meta: Record<string, string>
): { json: TokensJson; css: string } {
  const themes = BRANDS.flatMap((b) =>
    MODES.map((m) => ({
      id: themeId(b, m),
      name: `${BRAND_NAMES[b]} ${m === 'light' ? 'Light' : 'Dark'}`
    }))
  )

  const colorTokens: { name: string; value: Record<string, string> | string; usage: string }[] = []
  const addColor = (name: string, prop: string, usage: string) => {
    const value: Record<string, string> = {}
    for (const brand of BRANDS) {
      const pair = lightDark(tokens.get(brand)!.get(prop) ?? '')
      if (!pair) continue
      MODES.forEach((mode, i) => {
        const color = readableColor(pair[i])
        if (color) value[themeId(brand, mode)] = color
      })
    }
    if (Object.keys(value).length) colorTokens.push({ name, value, usage })
  }
  for (const ctx of CONTEXTS) {
    for (const [role, usage] of Object.entries(ROLES)) {
      addColor(role ? `${ctx}-${role}` : ctx, `--cx-${ctx}${role ? `-${role}` : ''}`, usage(ctx))
    }
  }
  // The root roles are aliases of `default`'s in every theme: `--cx-fg-main: var(--cx-default-fg-main)`.
  for (const [role, usage] of Object.entries(ROOT_ROLES)) {
    if (colorTokens.some((t) => t.name === `default-${role}`)) {
      colorTokens.push({ name: role, value: `{default-${role}}`, usage })
    }
  }
  for (const ctx of CONTEXTS) {
    for (const step of STEPS) {
      addColor(
        `${ctx}-${step}`,
        `--cx-${ctx}-${step}`,
        `Step ${step} of the ${ctx} tonal scale, the same in light and dark (\`--cx-${ctx}-${step}\`).`
      )
    }
  }

  // Spacing and shadows are one set for every brand: the page can't vary a length by theme, and
  // the README calls them shared. A brand that changes one stops the build here, so the claim
  // never goes stale.
  const base = tokens.get(DEFAULT_BRAND)!
  const shared = (k: string) => /^--cx-(space-|box-shadow-)/.test(k)
  const differ = BRANDS.flatMap((b) =>
    [...base.keys()]
      .filter((k) => shared(k) && tokens.get(b)!.get(k) !== base.get(k))
      .map((k) => `${b} ${k}`)
  )
  if (differ.length) {
    throw new Error(
      `tokens: spacing and shadows must be the same in every brand:\n${differ.join('\n')}`
    )
  }
  const spacing = [...base.entries()]
    .filter(([k]) => /^--cx-space-(zero|\dxs|xs|sm|md|lg|xl|\dxl)$/.test(k))
    .map(([k, v]) => ({
      name: k.slice(5),
      value: v,
      usage: `\`${k.replace('--cx-space-', '')}\` step: the \`p-*\`, \`m-*\` and \`gap-*\` utilities (\`${k}\`).`
    }))

  // Radii differ by brand, and only colours and shadows can differ by theme, so each brand's
  // radii are their own tokens.
  const radius = BRANDS.flatMap((brand) =>
    [...tokens.get(brand)!.entries()]
      .filter(([k, v]) => /^--cx-border-radius-[a-z0-9]+$/.test(k) && !v.startsWith('var('))
      .map(([k, v]) => ({
        name: `${brand}-radius-${k.replace('--cx-border-radius-', '')}`,
        value: v,
        usage: `${BRAND_NAMES[brand]}'s \`rounded-${k.replace('--cx-border-radius-', '')}\` (\`${k}\` under ${BRAND_NAMES[brand]}).`
      }))
  )

  const shadow = [...base.entries()]
    .filter(([k, v]) => /^--cx-box-shadow-(sm|md|lg)$/.test(k) && !/\b(var|from)\b/.test(v))
    .map(([k, v]) => ({
      name: k.slice(5),
      value: v,
      usage: `The \`${k.replace('--cx-box-', '')}\` utility, for cards, menus and overlays (\`${k}\`).`
    }))

  // One family per face of a brand: a brand that sets two roles in one face (Chassis sets ui and
  // prose in Inter) has one family for both. The page takes 12 families, and a key per role would reach 13 at a third
  // brand.
  const families: Record<string, string> = {}
  const groups: TokensJson['type']['groups'] = []
  for (const brand of BRANDS) {
    const value = resolver(tokens.get(brand)!)
    const familyOf: Record<string, string> = {}
    for (const role of ['ui', 'prose', 'display', 'code']) {
      // A family stack the page accepts: no functions, at most 200 characters.
      const stack = value(`--cx-font-family-${role}`).slice(0, 200)
      // Named after the brand and its face (`chassis-inter`), so roles that share a stack share a key.
      const face = /^"?([^",]+)/
        .exec(stack)![1]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
      familyOf[role] = `${brand}-${face}`
      families[familyOf[role]] = stack
    }
    const weight = (role: string) => Number(value(`--cx-font-weight-${role}-normal`) || 400)
    const style = (name: string, role: string, size: string, line: string, w: number) => ({
      name: `${brand}-${name}`,
      family: familyOf[role],
      fontSize: largest(value(size)),
      lineHeight: value(line).replace(/em$/, ''),
      fontWeight: w
    })
    groups.push({
      name: BRAND_NAMES[brand],
      family: familyOf.ui,
      styles: [
        ...[1, 2, 3, 4, 5, 6].map((n) =>
          style(
            `h${n}`,
            'display',
            `--cx-font-size-h${n}`,
            `--cx-line-height-h${n}`,
            Number(value('--cx-font-weight-heading')) || weight('display')
          )
        ),
        style('lead', 'prose', '--cx-font-size-lead', '--cx-line-height-lead', weight('prose')),
        style(
          'body',
          'prose',
          '--cx-font-size-body-md',
          '--cx-line-height-body-md',
          weight('prose')
        ),
        style('label', 'ui', '--cx-font-size-label-md', '--cx-line-height-label-md', weight('ui')),
        style('code', 'code', '--cx-font-size-code-md', '--cx-line-height-code-md', weight('code'))
      ]
    })
  }

  const json: TokensJson = {
    name: TITLE,
    version: 1,
    meta,
    color: { themes, tokens: colorTokens },
    type: {
      fonts: faces.map(({ family, style, weight, file }) => ({ family, style, weight, file })),
      families: { ...families, icon: '"Chassis-Icons"' },
      groups
    },
    spacing: { tokens: spacing },
    radius: { tokens: radius },
    shadow: { tokens: shadow }
  }
  return { json, css: tokensCss(json, faces) }
}

// Per brand, the values the README's brand table compares; it shows only the rows that differ.
export function brandSummary(tokens: Map<Brand, Map<string, string>>) {
  const summary = new Map<Brand, Record<string, string>>()
  for (const brand of BRANDS) {
    const value = resolver(tokens.get(brand)!)
    const face = (role: string) => /^"?([^",]+)/.exec(value(`--cx-font-family-${role}`))![1]
    summary.set(brand, {
      primary: lightDark(value('--cx-primary'))![0],
      secondary: lightDark(value('--cx-secondary'))![0],
      ui: face('ui'),
      prose: face('prose'),
      display: face('display'),
      code: face('code'),
      'display weight': `${value('--cx-font-weight-display-normal')} / ${value('--cx-font-weight-display-elegant')}`,
      'heading weight': `${value('--cx-font-weight-jumbo')} / ${value('--cx-font-weight-hero')} / ${value('--cx-font-weight-heading')}`,
      'prose elegant weight': value('--cx-font-weight-prose-elegant'),
      'radius-md': value('--cx-border-radius-md')
    })
  }
  return summary
}

// tokens.css laid out as the Design System page compiles it: the first theme on `:root` and its
// `[data-theme]`, a block per further theme, the lengths on `:root`, a class per type style and an
// @font-face per font. Each sync writes it, since a page synced from code never saves.
function tokensCss(json: TokensJson, faces: FontFace[]): string {
  const [first, ...rest] = json.color.themes
  const resolve = (v: string) => v.replace(/^\{(.+)\}$/, 'var(--$1)')
  const colors = (id: string) =>
    json.color.tokens
      .map(({ name, value }) => {
        const v = typeof value === 'string' ? value : (value[id] ?? value[first.id])
        return v ? `  --${name}: ${resolve(v)};` : ''
      })
      .filter(Boolean)
      .join('\n')
  const lines = [`/* ${TITLE} — generated from tokens.json */`]
  lines.push(
    `:root, [data-theme="${first.id}"] {\n${colors(first.id)}\n${json.shadow.tokens.map((t) => `  --${t.name}: ${t.value};`).join('\n')}\n}`
  )
  for (const theme of rest) lines.push(`[data-theme="${theme.id}"] {\n${colors(theme.id)}\n}`)
  const lengths = [...json.spacing.tokens, ...json.radius.tokens].map(
    (t) => `  --${t.name}: ${t.value};`
  )
  const fam = Object.entries(json.type.families).map(([k, v]) => `  --font-${k}: ${v};`)
  lines.push(`:root {\n${[...lengths, ...fam].join('\n')}\n}`)
  for (const group of json.type.groups) {
    for (const s of group.styles) {
      lines.push(
        `.${s.name} { font-family: var(--font-${s.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; }`
      )
    }
  }
  for (const f of faces) {
    lines.push(
      `@font-face { font-family: "${f.family}"; font-style: ${f.style}; font-weight: ${f.weight}; font-display: ${f.family === 'Chassis-Icons' ? 'block' : 'swap'}; src: url("${f.file}") format("woff2"); }`
    )
  }
  return lines.join('\n') + '\n'
}

export function writeTokens({ json, css }: ReturnType<typeof buildTokens>) {
  fs.writeFileSync(path.join(PROJECT, 'tokens.json'), JSON.stringify(json, null, 2) + '\n')
  fs.writeFileSync(path.join(PROJECT, 'tokens.css'), css)
}
