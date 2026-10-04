import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import { loadConfig } from '@chassis-ui/docs'
import { chassisDocs } from '@chassis-ui/docs/integration'
import { chassis } from './src/libs/astro'
import { iconSprite } from './src/libs/icon-sprite'
import { remarkCxExample, remarkCxExampleInlineChildren } from './src/libs/remark'

const root = import.meta.dirname
const config = loadConfig({ root })

// https://astro.build/config
export default defineConfig({
  outDir: '../../_site',
  build: {
    // The files of the build are written to _site/react/static/astro/ and requested as
    // /react/static/astro/…, which chassis-ui.com routes to this site by path. Under /static it
    // routes by the `Referer` header, and that of a script another script imports names no
    // site. The shared files stay on /static. Keep this folder in every name pattern below.
    assets: 'react/static/astro'
  },
  integrations: [
    chassisDocs({
      config,
      // Conflicts with the `Icon` export of `@chassis-ui/react`.
      shortcodes: { exclude: ['Icon'] },
      markdown: { remarkPlugins: [remarkCxExample, remarkCxExampleInlineChildren] }
    }),
    ...chassis({ config, root }),
    react(),
    iconSprite({ config })
  ],
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
              entryFileNames: `react/static/astro/docs.[hash].js`,
              chunkFileNames: `react/static/astro/docs.[hash].js`
            }
          }
        }
      }
    },
    build: {
      rolldownOptions: {
        output: {
          assetFileNames: (assetInfo: { name?: string }) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'react/static/astro/docs.[hash].css'
            }
            return 'react/static/astro/[name].[hash][extname]'
          }
        }
      }
    }
  }
})
