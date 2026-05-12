import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import type { Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const rehypeStripIsRaw: Plugin<[], Root> = function () {
  return function (tree) {
    visit(tree, 'element', (node) => {
      if (node.properties && 'is:raw' in node.properties) {
        delete node.properties['is:raw']
      }
    })
  }
}

export default defineConfig({
  base: '/react/',
  outDir: '../../_site',
  build: {
    assets: 'static'
  },
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism',
    rehypePlugins: [rehypeStripIsRaw]
  },
  site: 'https://chassis-ui.com',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
        }
      }
    },
    build: {
      rollupOptions: {
        external: ['@chassis-ui/css'],
        output: {
          paths: {
            '@chassis-ui/css': '/react/static/js/chassis.bundle.min.js'
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'static/css/docs-[hash].css'
            }
            return 'static/docs-[hash][extname]'
          }
        }
      }
    }
  }
})
