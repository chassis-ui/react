// `pnpm claude-design:publish`: sends `dist/project/` to the artifact in one publish,
// through a headless Claude Code session (`claude -p`) that may use only the Artifact tool and
// read-only file tools. The session needs the CLI signed in to a claude.ai account that can edit
// the artifact (`claude` then `/login`), or `CLAUDE_CODE_OAUTH_TOKEN` in the environment.
//
// The Artifact tool reviews what it publishes, so this writes `publish.json` beside the tree: the
// path map the publish call takes, each file's size and hash, and a scan of every text file for
// what it references outside itself. The session reviews that instead of reading the bundles.
import * as fs from 'fs'
import * as path from 'path'
import { spawnSync } from 'child_process'
import { CONTENT, OUT, PROJECT, ROOT } from './paths.ts'
import { artifactConfig, provenance } from './artifact.ts'
import { CHECKED, fileHash, treeHash, walk } from './tree.ts'

const TEXT = /\.(md|json|js|css|html|ts)$/

function scan(files: string[]) {
  const urls = new Map<string, number>()
  const findings: string[] = []
  for (const file of files.filter((f) => TEXT.test(f))) {
    const rel = path.relative(OUT, file)
    const text = fs.readFileSync(file, 'utf8')
    for (const m of text.matchAll(/https?:\/\/[^\s"'`()<>\\]+/g))
      urls.set(m[0], (urls.get(m[0]) ?? 0) + 1)
    const imports = text.match(/@import\b[^;]{0,120}/g)
    if (imports && rel.endsWith('.css')) findings.push(`${rel}: ${imports.length} @import rule(s)`)
    // Not Markdown: the README's loading example is an html code block.
    if (/\.(css|json)$/.test(rel) && /<script/i.test(text))
      findings.push(`${rel}: contains <script`)
  }
  return {
    findings,
    // URLs inside the bundles are mostly specification and namespace strings (w3.org, react.dev
    // error links); none is fetched by the previews, which load only the artifact's own files.
    urls: [...urls.entries()].sort((a, b) => b[1] - a[1]).map(([url, n]) => `${url} ×${n}`)
  }
}

if (!fs.existsSync(path.join(PROJECT, 'design-system.json'))) {
  throw new Error('publish: run `pnpm claude-design:build` first')
}
// The prompt tells the session the tree passed the check, so it has to be true.
const checked = fs.existsSync(CHECKED) ? JSON.parse(fs.readFileSync(CHECKED, 'utf8')).tree : ''
if (checked !== treeHash()) {
  throw new Error(
    'publish: dist/project/ changed since `pnpm claude-design:check` passed it; check it again'
  )
}
const config = artifactConfig()
const files = walk(PROJECT)
const map = Object.fromEntries(
  files
    .map((f) => path.relative(OUT, f))
    .filter((rel) => rel !== 'project/design-system.json')
    .sort()
    // The artifact serves no `.ts` type, so the declarations go as plain text.
    .map((rel) => [rel, rel.endsWith('.d.ts') ? { from: rel, contentType: 'text/plain' } : rel])
)
const manifest = Object.fromEntries(
  files.map((f) => [
    path.relative(OUT, f),
    {
      bytes: fs.statSync(f).size,
      sha256: fileHash(f)
    }
  ])
)
fs.writeFileSync(
  path.join(OUT, 'publish.json'),
  JSON.stringify({ url: config.url, files: map, manifest, scan: scan(files) }, null, 2) + '\n'
)

const prov = provenance()
const prompt = fs
  .readFileSync(path.join(CONTENT, 'publish-prompt.md'), 'utf8')
  .replaceAll('{{url}}', config.url)
  .replaceAll('{{root}}', OUT)
  .replaceAll('{{ref}}', prov.ref)

console.log(`claude-design:publish: ${files.length} files to ${config.url}, through claude -p`)
const run = spawnSync(
  'claude',
  [
    '-p',
    prompt,
    '--allowedTools',
    'Artifact',
    'Read',
    'Grep',
    'Glob',
    // Allowed tools are approved ahead; these are refused outright, whatever settings say.
    '--disallowedTools',
    'Bash',
    'Edit',
    'Write',
    'NotebookEdit',
    'WebFetch',
    'WebSearch',
    '--output-format',
    'json'
  ],
  {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  }
)
if (run.error) throw run.error
let result: {
  is_error: boolean
  result: string
  total_cost_usd: number
  num_turns: number
  permission_denials: unknown[]
}
try {
  result = JSON.parse(run.stdout)
} catch {
  console.error(run.stdout, run.stderr)
  process.exit(1)
}
console.log(result.result)
console.log(
  `\n${result.num_turns} turns, $${result.total_cost_usd.toFixed(2)}${result.permission_denials.length ? `, ${result.permission_denials.length} tool call(s) refused` : ''}`
)
// The prompt has the session end on one line saying how the publish went.
if (result.is_error || !/^RESULT: published\b/m.test(result.result)) process.exit(1)
