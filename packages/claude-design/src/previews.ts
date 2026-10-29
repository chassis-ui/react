// components/<Comp>/preview.html, one per component with stories: the card marker, then a root
// the preview runtime mounts the component's stories into. Cards are grouped as the docs sidebar
// groups their pages.
import * as fs from 'fs'
import * as path from 'path'
import { PROJECT, SITE } from './paths.ts'
import { CARDS, DEFAULT_CARD, cardHeight } from './cards.ts'

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Components whose docs page is titled after something else.
const PAGE_TITLES: Record<string, string> = {
  FloatingInput: 'Floating Labels',
  GridItem: 'Grid',
  InputAdorn: 'Input Group',
  Nav: 'Navs & Tabs',
  RadioGroup: 'Radio',
  RangeInput: 'Range'
}

export interface Page {
  title: string
  group: string
}

// The component pages of `data/sidebar.yml`, by the component each documents.
export function sidebarPages(components: string[]): Map<string, Page> {
  const lines = fs.readFileSync(path.join(SITE, 'data/sidebar.yml'), 'utf8').split('\n')
  const byTitle = new Map<string, Page>()
  let group = ''
  for (const line of lines) {
    const g = /^\s+- group:\s*(.+)$/.exec(line)
    if (g) group = g[1].trim()
    const t = /^\s+- title:\s*(.+)$/.exec(line)
    if (t && group) byTitle.set(normalize(t[1]), { title: t[1].trim(), group })
  }
  const pages = new Map<string, Page>()
  const missing = []
  for (const name of components) {
    const page = byTitle.get(normalize(PAGE_TITLES[name] ?? name))
    if (page) pages.set(name, page)
    else missing.push(name)
  }
  if (missing.length)
    throw new Error(
      `previews: no docs sidebar page for ${missing.join(', ')}; add them to PAGE_TITLES`
    )
  return pages
}

export function writePreviews(components: string[], pages: Map<string, Page>) {
  for (const name of components) {
    const card = CARDS[name] ?? DEFAULT_CARD
    const dir = path.join(PROJECT, 'components', name)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, 'preview.html'),
      `<!-- @dsCard group="${pages.get(name)!.group}" height=${cardHeight(card)} -->\n` +
        `<div id="root"></div>\n` +
        `<script>ChassisReact.__preview.mount(${JSON.stringify(name)})</script>\n`
    )
  }
}
