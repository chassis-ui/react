// `pnpm claude-design:check`: checks `dist/project/` before it is published.
//
// 1. The limits the Design System page enforces (file sizes, the bundle's own rules, the number
//    of themes and tokens) and the brand rules this build relies on, so a publish is never refused
//    halfway and the page drops nothing.
// 2. Every preview rendered in Chromium the way the page's preview frame renders it: tokens.css,
//    bundle.css, the libraries and the bundle loaded first, `<html data-theme>` set, then the
//    preview's own markup, with the card's folder as the base url as in the frame. Each runs in
//    every theme and fails on an uncaught error, a console error, nothing rendered, or one of the
//    system's own images that doesn't load.
import * as fs from 'fs'
import * as path from 'path'
import { pathToFileURL } from 'url'
import { chromium } from 'playwright'
import { BRANDS, MODES, PROJECT, WORK } from './paths.ts'
import { CHECKED, treeHash } from './tree.ts'

const KB = 1024
const MB = 1024 * KB
const LIMITS: [RegExp, number][] = [
  [/^components\/bundle\.js$/, 6 * MB],
  [/^components\/bundle\.css$/, 2 * MB],
  [/^components\/index\.d\.ts$/, 1.5 * MB],
  [/^components\/lib\/.*\.js$/, 2 * MB],
  [/\/preview\.html$/, 256 * KB],
  [/^components\/[^/]+\/README\.md$/, 64 * KB],
  [/^README\.md$/, 200 * KB],
  [/^tokens\.json$/, 512 * KB],
  [/.*/, 15 * MB]
]

function walk(dir: string, base = dir): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name), base)
        : [path.relative(base, path.join(dir, e.name))]
    )
}

export function checkLimits(): string[] {
  const problems: string[] = []
  const files = walk(PROJECT)
  // One publish call: at most 255 paths and 16 MiB.
  if (files.length > 255) problems.push(`${files.length} files; one publish takes 255`)
  let total = 0
  for (const rel of files) {
    const size = fs.statSync(path.join(PROJECT, rel)).size
    total += size
    const limit = LIMITS.find(([re]) => re.test(rel))![1]
    if (size > limit)
      problems.push(`${rel}: ${(size / KB).toFixed(0)} KB, over ${(limit / KB).toFixed(0)} KB`)
    if (
      /\.js$/.test(rel) &&
      /<\/script|<!--/i.test(fs.readFileSync(path.join(PROJECT, rel), 'utf8'))
    ) {
      problems.push(`${rel} holds </script or <!--`)
    }
  }
  if (total > 16 * MB)
    problems.push(`${(total / MB).toFixed(1)} MB in all; one publish takes 16 MiB`)

  // The preview runtime reads `<brand>-<mode>` back from the theme menu, so a brand id holds no
  // hyphen. Each brand is two themes, and the page takes 8 (below).
  for (const brand of BRANDS) {
    if (!/^[a-z][a-z0-9]*$/.test(brand))
      problems.push(`brand id ${brand}: lowercase letters and digits only`)
  }
  if (BRANDS.length * MODES.length > 8) {
    problems.push(
      `${BRANDS.length} brands make ${BRANDS.length * MODES.length} themes; the page takes 8`
    )
  }
  const tokens = JSON.parse(fs.readFileSync(path.join(PROJECT, 'tokens.json'), 'utf8'))
  const names = new Set<string>()
  for (const family of ['color', 'spacing', 'radius', 'shadow']) {
    for (const t of tokens[family].tokens) {
      if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(t.name)) problems.push(`token name ${t.name}`)
      if (names.has(t.name)) problems.push(`token ${t.name} twice`)
      names.add(t.name)
    }
  }
  for (const t of tokens.color.tokens) {
    for (const v of typeof t.value === 'string' ? [t.value] : Object.values(t.value)) {
      if (
        !/^(#[0-9a-f]{3,8}|(oklch|oklab|rgba?|hsla?)\([0-9.%\s/-]+\)|\{[A-Za-z0-9_.-]+\})$/.test(
          v as string
        )
      ) {
        problems.push(`colour ${t.name}: ${v}`)
      }
    }
  }
  for (const f of tokens.type.fonts) {
    if (!fs.existsSync(path.join(PROJECT, f.file))) problems.push(`font ${f.file} missing`)
  }
  // The page's own limits: past one, it drops what doesn't fit without saying so.
  const styles = tokens.type.groups.reduce(
    (n: number, g: { styles: unknown[] }) => n + g.styles.length,
    0
  )
  const caps: [string, number, number][] = [
    ['colours', tokens.color.tokens.length, 600],
    ['font families', Object.keys(tokens.type.families).length, 12],
    ['type groups', tokens.type.groups.length, 12],
    ['type styles', styles, 80],
    ['spacing tokens', tokens.spacing.tokens.length, 60],
    ['radius tokens', tokens.radius.tokens.length, 60],
    ['shadow tokens', tokens.shadow.tokens.length, 60]
  ]
  for (const [what, n, cap] of caps) {
    if (n > cap) problems.push(`tokens.json has ${n} ${what}; the page takes ${cap}`)
  }
  return problems
}

export async function checkPreviews(only?: string[]): Promise<string[]> {
  const dir = path.join(WORK, 'check')
  fs.mkdirSync(dir, { recursive: true })
  const project = pathToFileURL(PROJECT).href
  const components = fs
    .readdirSync(path.join(PROJECT, 'components'), { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() && fs.existsSync(path.join(PROJECT, 'components', e.name, 'preview.html'))
    )
    .map((e) => e.name)
    .filter((name) => !only?.length || only.includes(name))

  const browser = await chromium.launch()
  const problems: string[] = []
  try {
    const context = await browser.newContext({ viewport: { width: 960, height: 720 } })
    for (const name of components) {
      const markup = fs.readFileSync(path.join(PROJECT, 'components', name, 'preview.html'), 'utf8')
      for (const brand of BRANDS) {
        for (const mode of MODES) {
          const theme = `${brand}-${mode}`
          const file = path.join(dir, `${name}.${theme}.html`)
          fs.writeFileSync(
            file,
            `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">` +
              // The frame serves a card from its own folder: `../../<path>` is the system's file.
              `<base href="${project}/components/${name}/">` +
              `<link rel="stylesheet" href="${project}/tokens.css"><link rel="stylesheet" href="${project}/components/bundle.css">` +
              `<script src="${project}/components/lib/react.js"></script><script src="${project}/components/lib/react-dom.js"></script>` +
              `<script src="${project}/components/bundle.js"></script></head><body>${markup}</body></html>`
          )
          const page = await context.newPage()
          const errors: string[] = []
          page.on('pageerror', (e: Error) => errors.push(e.message))
          page.on('console', (m: { type(): string; text(): string }) => {
            if (m.type() === 'error') errors.push(m.text())
          })
          await page.goto(pathToFileURL(file).href)
          await page.waitForTimeout(400)
          const state = await page.evaluate(() => ({
            brand: document.documentElement.getAttribute('data-cx-brand'),
            // What the stories rendered, portaled overlays included, or for a page with no
            // stories (the cover) everything in it.
            elements: document.getElementById('root')
              ? document.querySelectorAll('[data-story] *, body > :not(#root):not(script) *').length
              : document.querySelectorAll('body > :not(script) *').length,
            // The system's own images (a relative src), as opposed to a story's remote ones.
            broken: [...document.images]
              .filter(
                (img) => !/^https?:/.test(img.getAttribute('src') ?? '') && img.naturalWidth === 0
              )
              .map((img) => img.getAttribute('src'))
          }))
          await page.close()
          if (errors.length) problems.push(`${name} (${theme}): ${errors.slice(0, 2).join(' | ')}`)
          else if (!state.elements) problems.push(`${name} (${theme}): rendered nothing`)
          else if (state.brand !== brand)
            problems.push(`${name} (${theme}): data-cx-brand is ${state.brand}`)
          else if (state.broken.length)
            problems.push(`${name} (${theme}): ${state.broken.join(', ')} did not load`)
        }
      }
    }
  } finally {
    await browser.close()
  }
  return problems
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const only = process.argv.slice(2)
  const problems = [...checkLimits(), ...(await checkPreviews(only))]
  for (const p of problems) console.error(`✗ ${p}`)
  if (problems.length) {
    console.error(`claude-design:check: ${problems.length} problem(s)`)
    process.exit(1)
  }
  // Publishing sends only a tree this passed, all of it: a run on some cards stamps nothing.
  if (!only.length) fs.writeFileSync(CHECKED, JSON.stringify({ tree: treeHash() }) + '\n')
  console.log('claude-design:check: limits and previews pass in every theme')
}
