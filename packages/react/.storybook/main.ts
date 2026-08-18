import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
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
      }
    }
    return viteConfig
  }
}
export default config
