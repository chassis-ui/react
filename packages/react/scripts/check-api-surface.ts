import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import * as ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DTS_PATH = path.resolve(__dirname, '../dist/index.d.ts')
const REPORT_PATH = path.resolve(__dirname, '../api-report.md')

// tsdown's dts bundler (rolldown-plugin-dts, via the TS checker) inlines some function return
// types as a raw structural union instead of a named alias — e.g. a component that can return
// either `children` as-is or a wrapping `<div>` gets `string | number | boolean |
// React.JSX.Element | Iterable<React.ReactNode> | null | undefined` instead of `ReactNode`, and a
// polymorphic-ref component's `RefAttributes<HTMLDivElement | HTMLSpanElement>` inlines that
// union too. The member order for these anonymous unions comes from the checker's internal type
// ids, which aren't stable across separate `tsc`/build invocations — running `pnpm react:build`
// twice with zero source changes can flip `A | B` to `B | A`. The union is semantically identical
// either way, but it makes this check's textual diff flap on unrelated PRs. Fix at the source
// where practical (annotate an explicit return type so the checker prints a named alias instead
// of expanding one), but sort every union's members here too so any remaining case — including
// ones introduced later — can't cause a false-positive diff.
function sortUnions(text: string): string {
  const sourceFile = ts.createSourceFile('api-surface.d.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

  function canonicalize(node: ts.Node): string {
    const start = node.getStart(sourceFile)
    const end = node.getEnd()
    const original = text.slice(start, end)

    const children: ts.Node[] = []
    node.forEachChild((child) => {
      // JSDoc precedes its declaration, so `child.getStart()` can fall *before* `start` (getStart
      // excludes leading JSDoc by default) — splicing that in below would corrupt offsets, and
      // there's nothing here worth canonicalizing anyway.
      if (child.kind !== ts.SyntaxKind.JSDoc) children.push(child)
    })
    if (children.length === 0) return original

    // Recurse first (innermost unions canonicalize independently of their container).
    const childTexts = children.map((child) => canonicalize(child))

    if (ts.isUnionTypeNode(node)) {
      return [...childTexts].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join(' | ')
    }

    // Not a union itself: splice each (possibly-rewritten) child back into this node's own
    // original text, right-to-left so earlier offsets stay valid. Everything outside a child's
    // span — punctuation, whitespace, comments between siblings — is left untouched.
    let spliced = original
    for (let i = children.length - 1; i >= 0; i--) {
      const relStart = children[i].getStart(sourceFile) - start
      const relEnd = children[i].getEnd() - start
      spliced = spliced.slice(0, relStart) + childTexts[i] + spliced.slice(relEnd)
    }
    return spliced
  }

  return canonicalize(sourceFile)
}

const HEADER = `<!--
This file is a checked-in snapshot of @chassis-ui/react's public type surface — the exact,
bundled \`.d.ts\` a consumer's editor sees, generated from \`dist/index.d.ts\` (built directly by
tsdown, see tsdown.config.ts). It exists to make an accidental breaking change to props/types
show up as an ordinary, reviewable diff on this file, instead of only being discovered by a
consumer after publish.

Regenerate with \`pnpm react:check:api:update\` after any *intentional* public API change (new prop,
renamed export, ...) and review the diff like any other code change. \`pnpm react:check:api\` (no
\`:update\`) is the check that fails CI/local runs when this file and the real build have drifted.
-->

\`\`\`ts
`

const FOOTER = '\n```\n'

function readDts(): string {
  if (!fs.existsSync(DTS_PATH)) {
    console.error(
      `Missing ${path.relative(process.cwd(), DTS_PATH)} — run \`pnpm react:build\` first, then re-run this check.`
    )
    process.exit(1)
  }
  return sortUnions(fs.readFileSync(DTS_PATH, 'utf8').trim())
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
    `${path.relative(process.cwd(), REPORT_PATH)} doesn't exist yet. Run \`pnpm react:check:api:update\` and commit it.`
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
console.error('If this change is intentional, run `pnpm react:check:api:update` and commit the result.')
console.error('If not, it means a component/type change accidentally altered the public API surface.')
process.exit(1)
