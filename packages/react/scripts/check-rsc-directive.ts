import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DIST = path.resolve(__dirname, '../dist')

// `@chassis-ui/react` ships a `'use client'` directive on every published JS entry point — the root
// `dist/index.js` and one `dist/<component-folder>.js` per `@chassis-ui/react/<folder>` subpath
// export (see RSC.md). Each comes from the first line of that entry's source module (`src/index.ts`,
// or `src/components/<folder>/index.ts`), which Rolldown preserves because it's an entry module —
// directives are only stripped for *non*-entry modules. That used to be re-added as a
// `tsdown.config.ts` `output.banner` too, back when Rolldown dropped it, which left the published
// bundle starting with a duplicated `'use client';"use client";`.
//
// Dropping the banner means the directive now depends on Rolldown's entry-module behavior holding,
// so this asserts it directly rather than leaving it to a human to remember to grep dist/ after a
// tsdown/rolldown bump — and, now that there are dozens of entries, that no one forgets the
// directive on a new component folder's barrel. Without it, a consumer's Server Component importing
// that subpath fails at `next build` with an unrelated-looking `createContext is not a function`.
//
// Shared chunks under `dist/chunks/` must *not* carry one: they're only ever reached through an
// entry that already establishes the client boundary, and a directive there would mean some source
// module other than an entry declared one — Rolldown drops those, but a future version might not.
//
// The one deliberate exception is SERVER_ENTRIES: entry points that must stay importable from a
// Server Component without creating a client boundary (`StaticTable`, #20). Those must *not* start
// with the directive — gaining one would silently turn a zero-JS component into a client one.
const SERVER_ENTRIES = new Set(['static-table.js'])
const DIRECTIVE = /^(['"])use client\1;?/
const ANY_DIRECTIVE = /(['"])use client\1;?/g

const failures: string[] = []
const rel = (file: string) => path.relative(process.cwd(), file)

const entries = fs
  .readdirSync(DIST)
  .filter((name) => name.endsWith('.js'))
  .map((name) => path.join(DIST, name))

if (!entries.some((file) => path.basename(file) === 'index.js')) {
  failures.push(`${rel(path.join(DIST, 'index.js'))} is missing — run \`pnpm build\` first.`)
}

for (const name of SERVER_ENTRIES) {
  if (!entries.some((file) => path.basename(file) === name)) {
    failures.push(`${rel(path.join(DIST, name))} is missing — was its component folder renamed?`)
  }
}

for (const file of entries) {
  const bundle = fs.readFileSync(file, 'utf8')

  if (SERVER_ENTRIES.has(path.basename(file))) {
    if (ANY_DIRECTIVE.test(bundle)) {
      failures.push(
        `${rel(file)} contains a 'use client' directive, but it's a server-safe entry point.\n` +
          `  It must stay importable from a Server Component without a client boundary — see RSC.md.`
      )
    }
    ANY_DIRECTIVE.lastIndex = 0
    continue
  }

  if (!DIRECTIVE.test(bundle)) {
    failures.push(
      `${rel(file)} does not start with a 'use client' directive.\n` +
        `  First 80 characters: ${JSON.stringify(bundle.slice(0, 80))}\n` +
        `  Its source barrel may be missing the directive, or Rolldown may have stopped preserving` +
        ` the entry module's directive — see RSC.md.`
    )
  }

  // The directive must appear exactly once. Two of them is what the now-removed banner produced:
  // valid JS (a directive prologue may hold several string literals), but a duplicated directive in
  // a published artifact is a sign the banner and Rolldown are both emitting it.
  const occurrences = (bundle.slice(0, 200).match(ANY_DIRECTIVE) ?? []).length
  if (occurrences > 1) {
    failures.push(
      `${rel(file)} has ${occurrences} 'use client' directives; expected exactly 1.\n` +
        `  Rolldown preserves the entry module's own directive, so tsdown.config.ts must not also add one via output.banner.`
    )
  }
}

const chunksDir = path.join(DIST, 'chunks')
const chunks = fs.existsSync(chunksDir)
  ? fs.readdirSync(chunksDir).map((name) => path.join(chunksDir, name))
  : []

for (const file of chunks.filter((f) => f.endsWith('.js'))) {
  if (DIRECTIVE.test(fs.readFileSync(file, 'utf8'))) {
    failures.push(
      `${rel(file)} starts with a 'use client' directive; only entry points (dist/*.js) should.`
    )
  }
}

// A known upstream issue (rolldown-plugin-dts#174) can leak the directive into the declaration
// output, where it has no business being.
const declarations = [
  ...fs.readdirSync(DIST).map((name) => path.join(DIST, name)),
  ...chunks
].filter((file) => file.endsWith('.d.ts'))

for (const file of declarations) {
  if (DIRECTIVE.test(fs.readFileSync(file, 'utf8'))) {
    failures.push(
      `${rel(file)} starts with a 'use client' directive; it should only be in the JS output.`
    )
  }
}

if (failures.length > 0) {
  console.error("'use client' directive check failed:\n")
  for (const failure of failures) console.error(`- ${failure}\n`)
  process.exit(1)
}

console.log(
  `All ${entries.length - SERVER_ENTRIES.size} client dist/*.js entry points carry exactly one ` +
    `'use client' directive; the ${SERVER_ENTRIES.size} server-safe one(s) and ` +
    `all ${chunks.filter((f) => f.endsWith('.js')).length} shared chunks carry none.`
)
