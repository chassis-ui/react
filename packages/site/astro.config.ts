import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import path from 'node:path'
import { chassis } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import { getSiteUrl } from '@chassis-ui/docs'

const site = getSiteUrl(getConfig())

// https://astro.build/config
export default defineConfig({
  outDir: '../../_site',
  integrations: [...chassis(), react()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism'
  },
  site,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve('./node_modules')],
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `static/js/docs.[hash].js`,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'static/css/docs.[hash].css'
            }
            return 'static/[name].[hash][extname]'
          }
        }
      }
    }
  }
})
