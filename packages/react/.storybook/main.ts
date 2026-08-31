import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@storybook/addon-themes'
  ],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true
    }
  },
  // Some component .scss files (e.g. Calendar, RangeCalendar) `@use "@chassis-ui/css/scss/config"`
  // directly, which forwards bare specifiers (`chassis-tokens`) that Sass can only resolve via an
  // explicit load path — same gap `tsdown.config.ts`'s `css.preprocessorOptions.scss.loadPaths`
  // closes for the production build.
  viteFinal: async (viteConfig) => {
    viteConfig.css = {
      ...viteConfig.css,
      preprocessorOptions: {
        ...viteConfig.css?.preprocessorOptions,
        scss: {
          ...viteConfig.css?.preprocessorOptions?.scss,
          loadPaths: [
            path.resolve(dirname, '../node_modules/@chassis-ui/css/scss/vendor'),
            path.resolve(dirname, '../node_modules')
          ]
        }
      },
      // Stories import components straight from `src/`, so each component's own side-effect
      // Sass import (e.g. Calendar.tsx's `import './Calendar.scss'`) gets compiled live by this
      // Vite instance rather than by tsdown — without this plugin, `Calendar.scss`/
      // `RangeCalendar.scss`'s bare `var(--primary)`-style references (see the identical comment
      // in `tsdown.config.ts`) never get rewritten to `--cx-primary`, so custom-property lookups
      // silently resolve to nothing (e.g. the selected-date highlight renders with a transparent
      // background instead of `--cx-primary`) even though the equivalent production build looks
      // correct. Must exactly match tsdown.config.ts's `css.postcss.plugins` or the two drift.
      postcss: {
        plugins: [postcssPrefixCustomProperties({ prefix: 'cx-', ignore: [/^--cx-/] })]
      }
    }
    return viteConfig
  }
}
export default config
