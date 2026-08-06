import path from 'path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  platform: 'neutral',
  exports: true,
  publint: true,
  // Matches `pnpm check:package`'s standalone `attw` invocation (see ci.yml): `esm-only` because
  // this package ships ESM-only by design, and `./style.css` is excluded because attw type-checks
  // JS/TS entrypoints and a plain CSS subpath export has no types for it to resolve. Keeping the
  // two in sync means this non-blocking local run doesn't nag about failures CI has already
  // decided aren't bugs.
  attw: { profile: 'esm-only', excludeEntrypoints: ['./style.css'] },
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
  // Rolldown strips module-level directives when bundling (directives only survive automatically
  // for entry modules or with `preserveModules: true`) — re-added here as a literal banner so it
  // survives as the first line of the emitted file, which is what RSC-aware bundlers scan for.
  // Scoped to `js` only: a bare string banner applies to every output tsdown emits, including
  // `dist/index.d.ts`, and `'use client';` has no business prefixing a type declaration file.
  banner: { js: "'use client';" }
})
