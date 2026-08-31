import path from 'node:path'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import { chassis } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import {
  remarkCxConfig,
  remarkCxDocsref,
  remarkCxExample,
  remarkCxExampleInlineChildren
} from './src/libs/remark'
import { chassisAutoImportPlugin } from './src/libs/shortcode'
import { getSiteUrl, getDocsMarkdownConfig } from '@chassis-ui/docs'

// https://astro.build/config
export default defineConfig({
  outDir: '../../_site',
  integrations: [...chassis(), react()],
  markdown: getDocsMarkdownConfig({
    anchors: getConfig().anchors,
    remarkPlugins: [
      chassisAutoImportPlugin(),
      remarkCxConfig,
      remarkCxDocsref,
      remarkCxExample,
      remarkCxExampleInlineChildren
    ]
  }),
  site: getSiteUrl(getConfig()),
  vite: {
    resolve: {
      // `@chassis-ui/react`'s `./style.css` export has to go through Vite's CSS pipeline, not
      // Node's own ESM loader — externalizing the package for SSR (Vite's default for a
      // node_modules dependency) makes the dev server import `dist/style.css` directly via
      // Node, which has no loader for `.css` and throws ERR_UNKNOWN_FILE_EXTENSION. `astro
      // build`'s static output doesn't hit this path (everything renders through Vite's build
      // pipeline up front), so this only ever surfaces in `astro dev`.
      noExternal: ['@chassis-ui/react']
    },
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              entryFileNames: `static/js/docs.[hash].js`,
              chunkFileNames: `static/js/docs.[hash].js`
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [
            // Resolves the bare `chassis-tokens` forward in `@chassis-ui/css/scss/config`
            // to the framework's default, which itself forwards `@chassis-ui/tokens`.
            path.resolve('./node_modules/@chassis-ui/css/scss/vendor')
          ]
        }
      }
    },
    build: {
      rolldownOptions: {
        output: {
          assetFileNames: (assetInfo: { name?: string }) => {
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
