// `pnpm claude-design:build`: writes the whole Claude Design system into `dist/project/`,
// the artifact's `project/` folder file for file, from this workspace. `pnpm claude-design:sync`
// checks and publishes it. See `AGENTS.md`.
//
// Run after `pnpm react:build`, which the root `claude-design:build` does first: it reads
// `packages/react/dist/` for the package's own CSS and types.
import * as fs from 'fs'
import * as path from 'path'
import { brandList, DEFAULT_BRAND, OUT, PROJECT } from './paths.ts'
import { buildStyles, controlCheck } from './css.ts'
import { brandSummary, buildTokens, writeTokens } from './tokens.ts'
import { fontFaces, writeFonts } from './assets.ts'
import { buildBundle, storyFiles, writeTypes } from './bundle.ts'
import { sidebarPages, writePreviews } from './previews.ts'
import { writeComponentReadmes, writeCover, writeReadme } from './docs.ts'
import { artifactConfig, provenance, writeIndex } from './artifact.ts'

const started = Date.now()
fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(path.join(PROJECT, 'components'), { recursive: true })

const styles = await buildStyles()
const problems = controlCheck(styles.tokens.get(DEFAULT_BRAND)!)
if (problems.length) {
  throw new Error(
    `css: the ${DEFAULT_BRAND} compile differs from the published chassis.css:\n${problems.slice(0, 20).join('\n')}`
  )
}
fs.writeFileSync(path.join(PROJECT, 'components/bundle.css'), styles.css)
console.log(
  `bundle.css: ${(styles.css.length / 1024).toFixed(0)} KB, ${styles.bakedRules} brand-baked rules`
)

const prov = provenance()
const faces = fontFaces()
writeFonts(faces)
const tokens = buildTokens(styles.tokens, faces, {
  // Provenance the page keeps and shows on a re-sync, never an input.
  source: 'github',
  repo: 'chassis-ui/react',
  ref: prov.ref,
  package: `@chassis-ui/react@${prov.react}, @chassis-ui/css@${prov.css}, @chassis-ui/tokens@${prov.tokens}`,
  synced: new Date().toISOString().slice(0, 10)
})
writeTokens(tokens)
console.log(
  `tokens.json: ${tokens.json.color.tokens.length} colours in ${tokens.json.color.themes.length} themes, ${faces.length} font files`
)

const stories = storyFiles()
const bundled = await buildBundle(stories)
const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`
console.log(
  `bundle.js: ${kb(bundled.bytes['bundle.js'])}, ${bundled.components.length} components from ${stories.length} story files; react ${kb(bundled.bytes['lib/react.js'])}, react-dom ${kb(bundled.bytes['lib/react-dom.js'])}`
)
console.log(`index.d.ts: ${kb(writeTypes())}`)

const pages = sidebarPages(bundled.components)
writePreviews(bundled.components, pages)
writeComponentReadmes(bundled.components, pages, stories)
writeReadme(brandSummary(styles.tokens))
writeCover()
writeIndex(
  artifactConfig(),
  prov,
  `Synced @chassis-ui/react ${prov.react}: ${bundled.components.length} components, ${brandList()} in light and dark`
)

console.log(`claude-design: built in ${((Date.now() - started) / 1000).toFixed(1)}s`)
