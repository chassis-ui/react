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
  getDocsPublicFsPath,
  getDocsStaticFsPath,
  validateChassisDocsPaths
} from './path'

// A list of pages that will be excluded from the sitemap.
const sitemapExcludes = ['/404']

export function chassis(): AstroIntegration[] {
  const sitemapExcludedUrls = sitemapExcludes.map((url) => `${getConfig().baseURL}${url}/`)

  // `astro check` doesn't need static assets copied into _site. Skip the copy
  // hooks so type-checking works without a built vendor/assets submodule.
  let isCheck = false

  return [
    chassisAutoImportIntegration(),
    {
      name: 'chassis-integration',
      hooks: {
        'astro:config:setup': ({ command }) => {
          isCheck = command === 'sync'
        },
        'astro:config:done': () => {
          if (isCheck) return
          cleanPublicDirectory()
          copyStatic()
          copyChassisAssets()
          copyChassisCSS()
          copyChassisIcons()
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
