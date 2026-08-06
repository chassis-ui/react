import path from 'path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  platform: 'neutral',
  exports: true,
  publint: true,
  attw: true,
  css: {
    preprocessorOptions: {
      scss: {
        // Same two resolution gaps `rollup.config.mjs`'s `includePaths` used to close (see the
        // comment that used to live there): directory-partial `@use '@chassis-ui/css/...'`
        // specifiers need an explicit load path, and `@chassis-ui/css`'s own `_vendor.scss`
        // forwards bare specifiers (`chassis-tokens`, `@chassis-ui/tokens/...`) that need one too.
        loadPaths: [
          path.resolve('./node_modules/@chassis-ui/css/scss/vendor'),
          path.resolve('./node_modules')
        ]
      }
    }
  },
  output: {
    // Rolldown strips module-level directives when bundling (directives only survive automatically
    // for entry modules or with `preserveModules: true`) — re-added here as a literal banner so it
    // survives as the first line of the emitted file, which is what RSC-aware bundlers scan for.
    banner: "'use client';"
  }
})
