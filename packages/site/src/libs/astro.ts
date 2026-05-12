import fs from 'node:fs'
import path from 'node:path'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import type { AstroIntegration } from 'astro'
import type { Element, Text } from 'hast'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getConfig } from './config'
import { rehypeCxTable } from '@chassis-ui/docs'
import { remarkCxConfig, remarkCxDocsref } from './remark'
import {
  getDocsFsPath,
  getChassisAssetsFsPath,
  getChassisCSSFsPath,
  getChassisIconsFsPath,
  getDocsPublicFsPath,
  getDocsStaticFsPath,
  validateChassisDocsPaths
} from './path'
import chassisAutoImport from './shortcode'
import { configurePrism } from './prism'

// A list of static file paths that will be aliased to a different path.
const staticFileAliases = {
  '/images/apple-touch-icon.png': '/apple-touch-icon.png',
  '/images/favicon.png': '/favicon.ico'
}

// A list of pages that will be excluded from the sitemap.
const sitemapExcludes = ['/404']

const headingsRangeRegex = new RegExp(`^h[${getConfig().anchors.min}-${getConfig().anchors.max}]$`)

export function chassis(): AstroIntegration[] {
  const sitemapExcludedUrls = sitemapExcludes.map((url) => `${getConfig().baseURL}${url}/`)

  configurePrism()

  // `astro check` doesn't need static assets copied into _site. Skip the copy
  // hooks so type-checking works without a built vendor/assets submodule.
  let isCheck = false

  return [
    chassisAutoImport(),
    {
      name: 'chassis-integration',
      hooks: {
        'astro:config:setup': ({ addWatchFile, command, updateConfig }) => {
          isCheck = command === 'sync'

          // Reload the config when the integration is modified.
          addWatchFile(path.join(getDocsFsPath(), 'src/libs/astro.ts'))

          // Watch static/ files and re-copy them on change in dev mode.
          if (command === 'dev') {
            addWatchFile(path.join(getDocsStaticFsPath()))
          }

          // Add the remark and rehype plugins.
          updateConfig({
            markdown: {
              rehypePlugins: [
                rehypeHeadingIds,
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: 'append',
                    content: [{ type: 'text', value: ' ' }],
                    properties: (element: Element) => ({
                      class: 'anchor-link',
                      ariaLabel: `Link to this section: ${(element.children[0] as Text).value}`
                    }),
                    test: (element: Element) => element.tagName.match(headingsRangeRegex)
                  }
                ],
                rehypeCxTable
              ],
              remarkPlugins: [remarkCxConfig, remarkCxDocsref]
            }
          })
        },
        'astro:config:done': () => {
          if (isCheck) return
          cleanPublicDirectory()
          copyStatic()
          copyChassisAssets()
          copyChassisCSS()
          copyChassisIcons()
          aliasStatic()
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
        },
        'astro:build:done': ({ dir }) => {
          validateChassisDocsPaths(dir)
        }
      }
    },
    // https://github.com/withastro/astro/issues/6475
    mdx() as AstroIntegration,
    sitemap({
      filter: (page) => sitemapFilter(page, sitemapExcludedUrls)
    })
  ]
}

function cleanPublicDirectory() {
  fs.rmSync(getDocsPublicFsPath(), { force: true, recursive: true })
}

function copyChassisAssets() {
  const source = getChassisAssetsFsPath()
  const destination = path.join(getDocsPublicFsPath(), 'static')

  if (!fs.existsSync(source)) {
    console.warn(`[chassis] Skipping vendor/assets copy — not built yet: ${source}`)
    console.warn('[chassis] Run `pnpm sync-submodules` from the repo root to build vendor/assets.')
    return
  }

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(source, destination, { recursive: true })
}

function copyChassisCSS() {
  const source = getChassisCSSFsPath()
  const destination = path.join(getDocsPublicFsPath(), 'static')

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(source, destination, { recursive: true })
}

// Copy the `icons` folder from chassis-icons to make it available from `/static/icons`.
function copyChassisIcons() {
  const source = path.join(getChassisIconsFsPath(), 'icons')
  const destination = path.join(getDocsPublicFsPath(), 'static', 'icons')

  fs.mkdirSync(destination, { recursive: true })
  fs.cpSync(source, destination, { recursive: true })
}

// Copy the content of the `static` folder to make it available from the `/` URL.
function copyStatic() {
  const source = getDocsStaticFsPath()
  const destination = getDocsPublicFsPath()

  copyStaticRecursively(source, destination)
}

// Alias (copy) some static files to different paths.
function aliasStatic() {
  const source = getChassisAssetsFsPath()
  const destination = getDocsPublicFsPath()

  if (!fs.existsSync(source)) {
    return
  }

  for (const [aliasSource, aliasDestination] of Object.entries(staticFileAliases)) {
    fs.cpSync(path.join(source, aliasSource), path.join(destination, aliasDestination))
  }
}

function copyStaticRecursively(source: string, destination: string) {
  const entries = fs.readdirSync(source, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isFile()) {
      fs.cpSync(path.join(source, entry.name), path.join(destination, entry.name))
    } else if (entry.isDirectory()) {
      fs.mkdirSync(path.join(destination, entry.name), { recursive: true })
      copyStaticRecursively(path.join(source, entry.name), path.join(destination, entry.name))
    }
  }
}

function sitemapFilter(page: string, excludedUrls: string[]) {
  if (excludedUrls.includes(page)) {
    return false
  }
  return true
}
