import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BUNDLE_PATH = path.resolve(__dirname, '../dist/index.js')
const DTS_PATH = path.resolve(__dirname, '../dist/index.d.ts')

// `@chassis-ui/react` ships one package-level `'use client'` directive (see RSC.md). It comes from
// `src/index.ts`, which Rolldown preserves because that file is the bundle's entry module —
// directives are only stripped for *non*-entry modules. That used to be re-added as a
// `tsdown.config.ts` `output.banner` too, back when Rolldown dropped it, which left the published
// bundle starting with a duplicated `'use client';"use client";`.
//
// Dropping the banner means the directive now depends on Rolldown's entry-module behavior holding,
// so this asserts it directly rather than leaving it to a human to remember to grep dist/ after a
// tsdown/rolldown bump. Without the directive, a consumer's Server Component importing this package
// fails at `next build` with an unrelated-looking `createContext is not a function`.
const DIRECTIVE = /^(['"])use client\1;?/

const bundle = fs.readFileSync(BUNDLE_PATH, 'utf8')
const failures: string[] = []

if (!DIRECTIVE.test(bundle)) {
  failures.push(
    `${path.relative(process.cwd(), BUNDLE_PATH)} does not start with a 'use client' directive.\n` +
      `  First 80 characters: ${JSON.stringify(bundle.slice(0, 80))}\n` +
      `  Rolldown may have stopped preserving the entry module's directive — see RSC.md.`
  )
}

// The directive must appear exactly once. Two of them is what the now-removed banner produced:
// valid JS (a directive prologue may hold several string literals), but a duplicated directive in
// a published artifact is a sign the banner and Rolldown are both emitting it.
const prologue = bundle.slice(0, 200)
const occurrences = (prologue.match(/(['"])use client\1;?/g) ?? []).length
if (occurrences > 1) {
  failures.push(
    `${path.relative(process.cwd(), BUNDLE_PATH)} has ${occurrences} 'use client' directives; expected exactly 1.\n` +
      `  Rolldown preserves the entry module's own directive, so tsdown.config.ts must not also add one via output.banner.`
  )
}

// A known upstream issue (rolldown-plugin-dts#174) can leak the directive into the declaration
// output, where it has no business being.
if (DIRECTIVE.test(fs.readFileSync(DTS_PATH, 'utf8'))) {
  failures.push(
    `${path.relative(process.cwd(), DTS_PATH)} starts with a 'use client' directive; it should only be in the JS bundle.`
  )
}

if (failures.length > 0) {
  console.error("'use client' directive check failed:\n")
  for (const failure of failures) console.error(`- ${failure}\n`)
  process.exit(1)
}

console.log("dist/index.js carries exactly one 'use client' directive.")
