import fs from 'node:fs'
import path from 'node:path'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import type { AstroIntegration } from 'astro'
import { getConfig } from './config'
import { chassisAutoImportIntegration } from './shortcode'
import {
  getChassisAssetsFsPath,
  getChassisCSSFsPath,
  getChassisIconsFsPath,
  getDocsFsPath,
  getDocsPublicFsPath,
  getDocsStaticFsPath,
  validateChassisDocsPaths
} from './path'

// Static file paths that will be aliased (copied) to a different destination path.
const staticFileAliases = {
  '/images/apple-touch-icon.png': '/apple-touch-icon.png',
  '/images/favicon.png': '/favicon.ico'
}

// Pages excluded from the generated sitemap.
const sitemapExcludes = ['/404', '/docs']

/**
 * Returns the full set of Astro integrations used by the Chassis docs site.
 *
 * Includes the core `chassis-integration` (asset copying, remark/rehype plugins,
 * post-build validation), MDX support, the sitemap generator, and a
 * post-process integration that injects sub-project sitemap references.
 */
export function chassis(): AstroIntegration[] {
  const config = getConfig()
  const sitemapExcludedUrls = sitemapExcludes.map((url) => `${config.baseURL}${url}/`)

  // `astro check` / `astro sync` doesn't need static assets copied into _site.
  // Track the command so the config:done hook can skip expensive file copies.
  let cmd = 'dev'

  return [
    chassisAutoImportIntegration(),
    {
      name: 'chassis-integration',
      hooks: {
        'astro:config:setup': ({ addWatchFile, command, updateConfig }) => {
          cmd = command
          // Reload the config when the integration is modified.
          addWatchFile(path.join(getDocsFsPath(), 'src/libs/astro.ts'))
          // Dev-only: multiple entry points import `@chassis-ui/css`, and Vite's dep
          // optimizer can load separate instances of it, multiplying any module-scope
          // state and event listeners it registers.
          if (cmd === 'dev') {
            // `@chassis-ui/docs` is a pnpm workspace `link:` override that resolves to a
            // symlink outside this repo. Its layouts serve raw script files (e.g.
            // `search.js`) by relative path, and Vite checks its allowlist against the
            // symlink's real target, which sits outside the detected project root.
            const docsPackagePath = path.join(process.cwd(), 'node_modules/@chassis-ui/docs')
            const docsRealPath = fs.existsSync(docsPackagePath)
              ? fs.realpathSync(docsPackagePath)
              : undefined

            // Explicitly setting `server.fs.allow` replaces Vite's own default (which
            // walks up from `process.cwd()` to the pnpm workspace root). Without also
            // including that workspace root here, every dependency hoisted to the
            // monorepo's top-level `node_modules` (e.g. `@astrojs/react/dist/client.js`,
            // the hydration runtime every interactive island depends on) gets 403'd.
            const workspaceRoot = findPnpmWorkspaceRoot(process.cwd())

            updateConfig({
              vite: {
                resolve: {
                  alias: [
                    // Regex, not a string key — a string alias prefix-matches subpaths too,
                    // breaking `@chassis-ui/css/scss/*` imports.
                    {
                      find: /^@chassis-ui\/css$/,
                      replacement: path.join(
                        process.cwd(),
                        'node_modules/@chassis-ui/css/js/index.js'
                      )
                    }
                  ]
                },
                optimizeDeps: {
                  exclude: ['@chassis-ui/docs']
                },
                server: {
                  fs: {
                    allow: docsRealPath ? [workspaceRoot, docsRealPath] : [workspaceRoot]
                  }
                }
              }
            })
          }
        },
        'astro:config:done': () => {
          if (cmd === 'sync') return
          cleanPublicDirectory()
          copyStatic()
          copyChassisAssets()
          copyChassisCSS()
          copyChassisIcons()
          aliasStatic()
          copyPagefindIndex()
        },
        'astro:server:setup': ({ server }) => {
          // In dev, watch the @chassis-ui/react dist so a lib rebuild triggers a page reload.
          const reactDist = path.resolve('../../packages/react/dist')
          if (fs.existsSync(reactDist)) {
            server.watcher.add(reactDist)
            server.watcher.on('change', (changed) => {
              if (changed.startsWith(reactDist)) {
                server.ws.send({ type: 'full-reload' })
              }
            })
          }

          // `remarkCxExample` reads `examples/**/*.tsx` files directly off disk to derive
          // each `<Example>`'s displayed source. Astro's content-collection loader only
          // reprocesses an `.mdx` file when that file's own content changes, so it has no way
          // to know an example file it read via `fs.readFileSync` changed too. Rewriting every
          // `.mdx` file with its own (unchanged) content forces a genuine reload of each entry,
          // re-running the remark plugins against the now-current example source.
          const examplesDir = path.join(getDocsFsPath(), 'examples')
          const contentDir = path.join(getDocsFsPath(), 'content')
          server.watcher.add(examplesDir)

          server.watcher.on('change', (changed) => {
            if (!changed.startsWith(examplesDir)) return
            for (const mdxFile of listFilesRecursive(contentDir, '.mdx')) {
              fs.writeFileSync(mdxFile, fs.readFileSync(mdxFile))
            }
            server.ws.send({ type: 'full-reload' })
          })
        },
        'astro:build:done': ({ dir }) => {
          validateChassisDocsPaths(dir)
        }
      }
    },
    // https://github.com/withastro/astro/issues/6475
    mdx() as AstroIntegration,
    sitemap({
      filter: (page) => !sitemapExcludedUrls.includes(page)
    })
  ]
}

/**
 * Walks up from `dir` to find the pnpm workspace root (mirrors Vite's own
 * `searchForWorkspaceRoot` default), stopping at the filesystem root if none is found.
 */
function findPnpmWorkspaceRoot(dir: string): string {
  let current = dir
  while (true) {
    if (fs.existsSync(path.join(current, 'pnpm-workspace.yaml'))) return current
    const parent = path.dirname(current)
    if (parent === current) return dir
    current = parent
  }
}

/**
 * Recursively lists files under `dir` whose name ends with `extension`.
 */
function listFilesRecursive(dir: string, extension: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFilesRecursive(entryPath, extension)
    return entry.name.endsWith(extension) ? [entryPath] : []
  })
}

/**
 * Copies the previously-generated Pagefind search index from `_site/assets/pagefind/`
 * into `public/assets/pagefind/` so `astro dev` can serve search at `/assets/pagefind/`,
 * matching the path prefix this site is proxied under in production.
 * No-op if no production build has been run yet — dev simply returns no results.
 */
function copyPagefindIndex() {
  const source = path.join(process.cwd(), '_site', 'assets', 'pagefind')
  if (!fs.existsSync(source)) return
  const destination = path.join(getDocsPublicFsPath(), 'assets', 'pagefind')

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(source, destination, { recursive: true })
}

/**
 * Deletes the contents of the `public/` directory before each dev/build run so
 * stale vendor assets (CSS, icons, images) from a previous build are removed.
 * The directory itself is preserved to avoid ENOTEMPTY errors on the root.
 * Errors on individual entries are intentionally swallowed — the directory may
 * contain locked or read-only files in some environments.
 */
function cleanPublicDirectory() {
  const dir = getDocsPublicFsPath()
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry)
    try {
      fs.rmSync(entryPath, { force: true, recursive: true })
    } catch {
      // ignore
    }
  }
}

/**
 * Copies the Chassis assets package output into `public/static/`.
 */
function copyChassisAssets() {
  const source = getChassisAssetsFsPath()
  const destination = path.join(getDocsPublicFsPath(), 'static')

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(source, destination, { recursive: true })
}

/**
 * Copies the compiled Chassis CSS bundle into `public/static/`.
 */
function copyChassisCSS() {
  const source = getChassisCSSFsPath()
  const destination = path.join(getDocsPublicFsPath(), 'static')

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(source, destination, { recursive: true })
}

/**
 * Copies the `icons/` folder from the Chassis Icons package into
 * `public/static/icons/` so icons are served from `/static/icons/`.
 */
function copyChassisIcons() {
  const font_source = path.join(getChassisIconsFsPath(), 'icons')
  const destination = path.join(getDocsPublicFsPath(), 'static', 'icons')

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(font_source, destination, { recursive: true })
}

/**
 * Copies the contents of the `static/` source directory into `public/`
 * so files are served from the root URL (`/`).
 */
function copyStatic() {
  const source = getDocsStaticFsPath()
  const destination = getDocsPublicFsPath()

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(source, destination, { recursive: true })
}

/**
 * Copies select static files from the Chassis assets package to alternative
 * destination paths (e.g. `apple-touch-icon.png` → `/apple-touch-icon.png`).
 */
function aliasStatic() {
  const source = getChassisAssetsFsPath()
  const destination = path.join(getDocsPublicFsPath())

  for (const [aliasSource, aliasDestination] of Object.entries(staticFileAliases)) {
    fs.cpSync(path.join(source, aliasSource), path.join(destination, aliasDestination))
  }
}
