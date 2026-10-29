// components/bundle.js, components/lib/react{,-dom}.js and components/index.d.ts.
//
// The bundle is one classic script that assigns `window.ChassisReact`: the library built from
// `packages/react/src/index.ts` (not from its `dist/`, whose ESM chunks a classic script can't
// load), the
// `@internationalized/date` helpers its date components take values from, and the preview runtime
// with every story, so the stories and the library share one copy of every context. React and
// ReactDOM are the page's libraries, read from `window`, and React 19 ships no UMD build, so both
// are bundled here as classic scripts from the workspace's own copy.
import * as fs from 'fs'
import * as path from 'path'
import { build, type Plugin } from 'esbuild'
import { DEFAULT_BRAND, NAMESPACE, PROJECT, REACT, REACT_MODULES, SRC, WORK } from './paths.ts'
import { CARDS, DEFAULT_CARD } from './cards.ts'

export interface StoryFile {
  file: string
  title: string
  component: string
}

// Every story file whose meta names a component; the overview pages, which compose several
// families, have none and get no card.
export function storyFiles(): StoryFile[] {
  const dir = path.join(REACT, 'stories')
  const out: StoryFile[] = []
  for (const rel of fs.readdirSync(dir, { recursive: true }) as string[]) {
    if (!rel.endsWith('.stories.tsx') || rel.startsWith('overview')) continue
    const source = fs.readFileSync(path.join(dir, rel), 'utf8')
    const title = /^\s*title:\s*'([^']+)'/m.exec(source)?.[1]
    const component = /^\s*component:\s*([A-Z][A-Za-z0-9]*)/m.exec(source)?.[1]
    if (!title || !component) throw new Error(`bundle: ${rel} has no meta title or component`)
    out.push({ file: path.join(dir, rel), title, component })
  }
  return out.sort((a, b) => a.component.localeCompare(b.component) || a.file.localeCompare(b.file))
}

const JSX_RUNTIME = `
const React = window.React;
const jsx = (type, props, key) => React.createElement(type, key === undefined ? props : { ...props, key });
module.exports = { jsx, jsxs: jsx, jsxDEV: jsx, Fragment: React.Fragment };
`
// Story files import `fn`, `expect` and friends for their `play` functions, which never run here.
// Every name resolves to a no-op; `fn()` returns a callable spy-shaped function.
const STORYBOOK_STUB = `
const noop = () => {};
const fn = (impl) => { const f = (...a) => (impl ? impl(...a) : undefined); for (const k of ['mockName','mockImplementation','mockReturnValue','mockResolvedValue']) f[k] = () => f; return f; };
module.exports = new Proxy({ fn }, { get: (t, k) => (k in t ? t[k] : k === '__esModule' ? false : noop) });
`

// Points React at the page's globals and stubs what only Storybook provides.
function shims(globals: Record<string, string>): Plugin {
  return {
    name: 'claude-design-shims',
    setup(b) {
      const filter =
        /^(react|react-dom|react-dom\/client|react\/jsx-runtime|react\/jsx-dev-runtime|storybook\/.*|@storybook\/.*)$/
      b.onResolve({ filter }, (args) =>
        args.path in globals || /storybook/.test(args.path)
          ? { path: args.path, namespace: 'shim' }
          : undefined
      )
      b.onLoad({ filter: /.*/, namespace: 'shim' }, (args) => {
        if (/jsx-(dev-)?runtime$/.test(args.path)) return { contents: JSX_RUNTIME, loader: 'js' }
        if (/storybook/.test(args.path)) return { contents: STORYBOOK_STUB, loader: 'js' }
        return { contents: `module.exports = window.${globals[args.path]};`, loader: 'js' }
      })
      // packages/react's `sideEffects` names the dist chunk of this module, not its source, so a
      // build from source would drop every barrel's bare import of it, and with it the focus-ring
      // fix it installs.
      b.onResolve({ filter: /suppressFocusRingGlobally$/ }, (args) => ({
        path: path.join(args.resolveDir, `${args.path}.ts`),
        sideEffects: true
      }))
      // Component Sass builds into dist/style.css, which bundle.css carries.
      b.onResolve({ filter: /\.s?css$/ }, (args) => ({ path: args.path, namespace: 'empty' }))
      b.onLoad({ filter: /.*/, namespace: 'empty' }, () => ({ contents: '', loader: 'js' }))
      b.onResolve({ filter: /\?raw$/ }, async (args) => {
        const r = await b.resolve(args.path.replace(/\?raw$/, ''), {
          resolveDir: args.resolveDir,
          kind: 'import-statement'
        })
        return { path: r.path, namespace: 'raw' }
      })
      b.onLoad({ filter: /.*/, namespace: 'raw' }, (args) => ({
        contents: fs.readFileSync(args.path, 'utf8'),
        loader: 'text'
      }))
    }
  }
}

const common = {
  bundle: true,
  format: 'iife' as const,
  platform: 'browser' as const,
  target: 'es2022',
  minify: true,
  legalComments: 'none' as const,
  define: {
    'process.env.NODE_ENV': '"production"',
    __DEFAULT_BRAND__: JSON.stringify(DEFAULT_BRAND)
  },
  nodePaths: [REACT_MODULES],
  logLevel: 'warning' as const
}

// A classic script must never end the inline element a consumer may paste it into.
function scriptSafe(code: string, file: string): string {
  const safe = code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '\\x3C!--')
  if (/<\/script|<!--/i.test(safe)) throw new Error(`bundle: ${file} still holds </script or <!--`)
  return safe
}

// `globalName` makes the script's one top-level statement `var <name> = (() => …)()`, which a
// classic script puts on `window`.
async function bundle(
  entry: string,
  outfile: string,
  globalName: string,
  globals: Record<string, string>,
  header = ''
) {
  const result = await build({
    ...common,
    globalName,
    stdin: { contents: entry, resolveDir: WORK, loader: 'ts' },
    write: false,
    plugins: [shims(globals)]
  })
  const code = scriptSafe(result.outputFiles[0].text, outfile)
  fs.mkdirSync(path.dirname(outfile), { recursive: true })
  fs.writeFileSync(outfile, header + code)
  return code.length
}

export interface BundleResult {
  components: string[]
  bytes: Record<string, number>
}

export async function buildBundle(files: StoryFile[]): Promise<BundleResult> {
  fs.mkdirSync(WORK, { recursive: true })
  const lib = path.join(PROJECT, 'components/lib')
  const bytes: Record<string, number> = {}

  bytes['lib/react.js'] = await bundle(
    `module.exports = require('react')`,
    path.join(lib, 'react.js'),
    'React',
    {}
  )
  // ReactDOM and its client entry as one global, as the UMD build of React 18 was.
  bytes['lib/react-dom.js'] = await bundle(
    `module.exports = Object.assign({}, require('react-dom'), require('react-dom/client'))`,
    path.join(lib, 'react-dom.js'),
    'ReactDOM',
    { react: 'React' }
  )

  const components = [...new Set(files.map((f) => f.component))]
  const imports = files.map((f, i) => `import * as s${i} from ${JSON.stringify(f.file)}`).join('\n')
  const registry = components
    .map((name) => {
      const mods = files.flatMap((f, i) => (f.component === name ? [`s${i}`] : []))
      return `  ${JSON.stringify(name)}: { modules: [${mods.join(', ')}], card: ${JSON.stringify(CARDS[name] ?? DEFAULT_CARD)} }`
    })
    .join(',\n')
  const entry = `
export * from ${JSON.stringify(path.join(REACT, 'src/index.ts'))}
export * as Dates from '@internationalized/date'
import { followTheme, mount } from ${JSON.stringify(path.join(SRC, 'runtime/preview.ts'))}
${imports}
const registry = {
${registry}
}
export const __preview = { mount: (name, el) => mount(registry, name, el), followTheme }
`
  const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NAMESPACE, components: components.map((name) => ({ name })) })} */\n`
  bytes['bundle.js'] = await bundle(
    entry,
    path.join(PROJECT, 'components/bundle.js'),
    NAMESPACE,
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM',
      'react/jsx-runtime': 'React',
      'react/jsx-dev-runtime': 'React'
    },
    header
  )
  return { components, bytes }
}

// components/index.d.ts: the declarations tsdown wrote, joined into one file. The page reads it as
// documentation (`<Comp>Props` for the props of a card) and never type-checks it, so the chunk
// files' import and re-export lines, which only rename, are dropped.
export function writeTypes() {
  const dist = path.join(REACT, 'dist')
  const files = fs
    .readdirSync(path.join(dist, 'chunks'))
    .filter((f) => f.endsWith('.d.ts'))
    .sort()
    .map((f) => path.join(dist, 'chunks', f))
  const text = files
    .map((f) =>
      fs
        .readFileSync(f, 'utf8')
        .split('\n')
        .filter((line) => !/^(import |export \{|\/\/# sourceMappingURL)/.test(line))
        .join('\n')
        .trim()
    )
    .filter(Boolean)
    .join('\n\n')
  fs.writeFileSync(
    path.join(PROJECT, 'components/index.d.ts'),
    `// @chassis-ui/react — declarations as built, for reading.\n\n${text}\n`
  )
  return text.length
}
