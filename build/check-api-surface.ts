import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DTS_PATH = path.resolve(__dirname, '../packages/react/dist/index.d.ts')
const REPORT_PATH = path.resolve(__dirname, '../packages/react/api-report.md')

const HEADER = `<!--
This file is a checked-in snapshot of @chassis-ui/react's public type surface — the exact,
rolled-up \`.d.ts\` a consumer's editor sees, generated from \`dist/index.d.ts\` (built by
\`rollup-plugin-dts\`, see rollup.config.mjs). It exists to make an accidental breaking change to
props/types show up as an ordinary, reviewable diff on this file, instead of only being
discovered by a consumer after publish.

Regenerate with \`pnpm api:report:update\` after any *intentional* public API change (new prop,
renamed export, ...) and review the diff like any other code change. \`pnpm api:report\` (no
\`:update\`) is the check that fails CI/local runs when this file and the real build have drifted.
-->

\`\`\`ts
`

const FOOTER = '\n```\n'

function readDts(): string {
  if (!fs.existsSync(DTS_PATH)) {
    console.error(
      `Missing ${path.relative(process.cwd(), DTS_PATH)} — run \`pnpm lib:build\` first, then re-run this check.`
    )
    process.exit(1)
  }
  return fs.readFileSync(DTS_PATH, 'utf8').trim()
}

function buildReport(dts: string): string {
  return `${HEADER}${dts}${FOOTER}`
}

const shouldUpdate = process.argv.includes('--update')
const report = buildReport(readDts())

if (shouldUpdate) {
  fs.writeFileSync(REPORT_PATH, report)
  console.log(`Updated ${path.relative(process.cwd(), REPORT_PATH)} from the current build.`)
  process.exit(0)
}

const existing = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, 'utf8') : null

if (existing === report) {
  console.log('API surface matches api-report.md.')
  process.exit(0)
}

if (existing === null) {
  console.error(
    `${path.relative(process.cwd(), REPORT_PATH)} doesn't exist yet. Run \`pnpm api:report:update\` and commit it.`
  )
  process.exit(1)
}

const existingLines = existing.split('\n')
const reportLines = report.split('\n')
const maxLines = Math.max(existingLines.length, reportLines.length)
let firstDiffLine = -1
let diffCount = 0
for (let i = 0; i < maxLines; i++) {
  if (existingLines[i] !== reportLines[i]) {
    if (firstDiffLine === -1) firstDiffLine = i + 1
    diffCount++
  }
}

console.error(
  `api-report.md is out of date with the current build: ${diffCount} line(s) differ, first at line ${firstDiffLine}.`
)
console.error('If this change is intentional, run `pnpm api:report:update` and commit the result.')
console.error('If not, it means a component/type change accidentally altered the public API surface.')
process.exit(1)
