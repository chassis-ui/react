// README.md, components/<Comp>/README.md and the cover.
//
// The system's README is `content/README.md` with the brand table filled in from the
// token values. A component's README is its docs page's summary, its props from the API files
// `pnpm react:generate` writes, and the names of the stories its card shows.
import * as fs from 'fs'
import * as path from 'path'
import { execFileSync } from 'child_process'
import {
  ASSETS,
  BRAND_NAMES,
  BRANDS,
  brandList,
  CONTENT,
  DEFAULT_BRAND,
  MODES,
  PROJECT,
  REACT_MODULES,
  SITE,
  type Brand
} from './paths.ts'
import type { Page } from './previews.ts'
import type { StoryFile } from './bundle.ts'
import { CARDS } from './cards.ts'

const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const cell = (s: string) =>
  s
    .replace(/\|/g, '\\|')
    .replace(/\s*\n\s*/g, ' ')
    .trim()

// Where a project downloads a brand's logos and images: the public assets repository, at the tag
// (else the commit) of the `vendor/assets` checkout this system is built from. The names are each
// brand's own images, which every brand keeps under the same names; the docs imagery the brands
// share stays out of the list.
function brandAssets() {
  const ref =
    gitIn(ASSETS, 'describe', '--tags', '--exact-match') || gitIn(ASSETS, 'rev-parse', 'HEAD')
  const base = `https://raw.githubusercontent.com/chassis-ui/assets/${ref}`
  const names = new Set<string>()
  for (const brand of BRANDS) {
    const dir = path.join(ASSETS, 'source', brand, 'docs/images')
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir, { recursive: true }) as string[]) {
      if (fs.statSync(path.join(dir, f)).isFile()) names.add(f.split(path.sep).join('/'))
    }
  }
  const example = `${base}/source/${DEFAULT_BRAND}/docs/images/logo/logo-light.svg`
  return { base, names: [...names].sort(), example }
}

// A git query in `dir`, or '' where it has no answer (no tag at that commit).
function gitIn(dir: string, ...args: string[]) {
  try {
    return execFileSync('git', args, {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return ''
  }
}

export function writeReadme(summary: Map<Brand, Record<string, string>>) {
  // Only what differs: a row the brands share says nothing here.
  const rows = Object.keys(summary.get(DEFAULT_BRAND)!).filter(
    (row) => new Set(BRANDS.map((b) => summary.get(b)![row])).size > 1
  )
  const table = [
    `| | ${BRANDS.map((b) => BRAND_NAMES[b]).join(' | ')} |`,
    `| --- | ${BRANDS.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => {
      const label =
        {
          ui: 'UI face (`font-ui`)',
          prose: 'Prose face (`font-prose`)',
          display: 'Display face (`font-display`)',
          code: 'Code face (`font-code`)',
          'display weight': 'Display weight, normal / elegant',
          'heading weight': 'Jumbo / hero / heading weight',
          'prose elegant weight': 'Elegant prose weight',
          'radius-md': 'Control radius (`--cx-border-radius-md`)'
        }[row] ?? `\`--cx-${row}\` (light)`
      return `| ${label} | ${BRANDS.map((b) => `\`${summary.get(b)![row]}\``).join(' | ')} |`
    })
  ].join('\n')
  const react = JSON.parse(
    fs.readFileSync(path.join(REACT_MODULES, 'react/package.json'), 'utf8')
  ).version
  // The brand lists of the README come from BRANDS, so a new brand needs no edit there.
  const count = ['one', 'two', 'three', 'four'][BRANDS.length - 1] ?? String(BRANDS.length)
  const list = brandList()
  const themes = BRANDS.flatMap((b) =>
    MODES.map((m) => `${BRAND_NAMES[b]} ${m === 'light' ? 'Light' : 'Dark'}`)
  )
  const example = BRANDS.find((b) => b !== DEFAULT_BRAND) ?? DEFAULT_BRAND
  const assets = brandAssets()
  const text = fs
    .readFileSync(path.join(CONTENT, 'README.md'), 'utf8')
    .replace('<!-- brand-names -->', `${count} brand${BRANDS.length > 1 ? 's' : ''}, ${list}`)
    .replace('<!-- brand-ids -->', BRANDS.map((b) => `\`${b}\``).join(' · '))
    .replace('<!-- default-brand -->', BRAND_NAMES[DEFAULT_BRAND])
    .replace('<!-- theme-names -->', themes.join(', '))
    .replaceAll('{{brand}}', example)
    .replaceAll('{{default}}', DEFAULT_BRAND)
    .replaceAll('<!-- default-brand-id -->', DEFAULT_BRAND)
    .replace('<!-- brand-ids-json -->', JSON.stringify(BRANDS))
    .replace(
      '<!-- brand-logo-map -->',
      BRANDS.map((b) => `${b}: '/_blob/<${b} logo id>'`).join(', ')
    )
    .replace('<!-- brand-asset-names -->', assets.names.map((n) => `\`${n}\``).join(', '))
    .replace('<!-- brand-asset-url -->', `${assets.base}/source/<brand>/docs/images/<file>`)
    .replace('<!-- default-asset-url -->', `${assets.base}/source/default/docs/images/<file>`)
    .replace('<!-- brand-asset-example -->', assets.example)
    .replace('<!-- brand-table -->', table)
    .replace('<!-- react-version -->', react)
  fs.writeFileSync(path.join(PROJECT, 'README.md'), text)
}

interface ApiProp {
  name: string
  description: string
  required: boolean
  defaultValue: { value: unknown } | null
  type: { name: string; raw?: string; value?: { value: string }[] }
}

function typeOf(t: ApiProp['type']): string {
  if (t.name === 'enum' && t.value?.length && t.value.length <= 12)
    return t.value.map((v) => v.value).join(' | ')
  return t.raw ?? t.name
}

// The docs page of a component: the page the sidebar names, else the first that renders its
// prop table.
function docsPage(name: string, page: Page): string | undefined {
  const dir = path.join(SITE, 'content/components')
  const byTitle = path.join(dir, `${kebab(page.title)}.mdx`)
  if (fs.existsSync(byTitle)) return fs.readFileSync(byTitle, 'utf8')
  for (const f of fs.readdirSync(dir)) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8')
    if (text.includes(`<PropTable component="${name}"`)) return text
  }
  return undefined
}

// The story exports of a component's files, as written (`StaticBackdrop`).
function storyExports(files: StoryFile[]): string[] {
  return files.flatMap((f) =>
    [...fs.readFileSync(f.file, 'utf8').matchAll(/^export const ([A-Z][A-Za-z0-9]*)\b/gm)].map(
      (m) => m[1]
    )
  )
}

export function writeComponentReadmes(
  components: string[],
  pages: Map<string, Page>,
  stories: StoryFile[]
) {
  const missing: string[] = []
  for (const name of components) {
    const mdx = docsPage(name, pages.get(name)!)
    const description = mdx && /^description:\s*(.+)$/m.exec(mdx)?.[1].trim()
    if (!description) missing.push(name)
    const apiFile = path.join(SITE, 'content/api', `${name}.json`)
    const api = fs.existsSync(apiFile) ? JSON.parse(fs.readFileSync(apiFile, 'utf8')) : undefined
    const props = Object.values((api?.props ?? {}) as Record<string, ApiProp>).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    const parts = [
      `# ${name}`,
      '',
      description ?? `${name} from @chassis-ui/react.`,
      ...(api?.description ? ['', api.description.trim()] : []),
      '',
      `On the docs site: ${pages.get(name)!.group}, ${pages.get(name)!.title}.`
    ]
    if (props.length) {
      parts.push(
        '',
        '## Props',
        '',
        '| Prop | Type | Default | Description |',
        '| --- | --- | --- | --- |'
      )
      for (const p of props) {
        const def = p.defaultValue?.value
        parts.push(
          `| \`${p.name}\`${p.required ? ' (required)' : ''} | \`${cell(typeOf(p.type))}\` | ${def === undefined || def === null || def === '' ? '' : `\`${cell(String(def))}\``} | ${cell(p.description ?? '')} |`
        )
      }
    }
    const exports = storyExports(stories.filter((s) => s.component === name))
    const card = CARDS[name]
    // A card setting must name stories that exist: a renamed story would leave it on another.
    const unknown = [card?.primary, ...(card?.skip ?? [])].filter((k) => k && !exports.includes(k))
    if (unknown.length)
      throw new Error(
        `docs: cards.ts names ${unknown.join(', ')} for ${name}, which has no such story`
      )
    const spaced = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    const names = exports.map(spaced)
    if (card?.mode === 'single' && card.primary) {
      const others = names.filter((n) => n !== spaced(card.primary!))
      parts.push(
        '',
        '## Stories',
        '',
        `The card shows the ${spaced(card.primary)} story.${others.length ? ` Storybook also has ${others.join(', ')}.` : ''}`
      )
    } else if (names.length) {
      const shown = names.filter((n) => !card?.skip?.map(spaced).includes(n))
      parts.push('', '## Stories', '', `The card shows the Storybook stories: ${shown.join(', ')}.`)
    }
    fs.writeFileSync(path.join(PROJECT, 'components', name, 'README.md'), parts.join('\n') + '\n')
  }
  if (missing.length) throw new Error(`docs: no docs page description for ${missing.join(', ')}`)
}

export function writeCover() {
  const dir = path.join(PROJECT, 'components/Cover')
  fs.mkdirSync(dir, { recursive: true })
  fs.copyFileSync(path.join(CONTENT, 'cover.html'), path.join(dir, 'preview.html'))
}
