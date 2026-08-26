import path from 'path'
import { defineConfig } from 'tsdown'
import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  platform: 'neutral',
  exports: true,
  publint: true,
  // Published dist is what every consumer downloads — minify the JS/CSS output instead of
  // shipping it pretty-printed. `dts` isn't affected: tsdown bundles declarations through a
  // separate pass that this flag doesn't touch, so `dist/index.d.ts` stays readable.
  minify: true,
  // Matches `pnpm check:package`'s standalone `attw` invocation (see ci.yml): `esm-only` because
  // this package ships ESM-only by design, and `./style.css` is excluded because attw type-checks
  // JS/TS entrypoints and a plain CSS subpath export has no types for it to resolve. Keeping the
  // two in sync means this non-blocking local run doesn't nag about failures CI has already
  // decided aren't bugs.
  attw: { profile: 'esm-only', excludeEntrypoints: ['./style.css'] },
  css: {
    minify: true,
    // Sass here compiles `@chassis-ui/css`'s raw SCSS sources directly (see `loadPaths` below),
    // not its already-postcss-processed dist — so this build needs the same safety net
    // chassis-css's own `build/postcss.config.js` runs: prefixing every custom property that
    // isn't already `--cx-`. This isn't a no-op today: `Calendar.scss`/`RangeCalendar.scss` use
    // bare `var(--primary)`-style references and rely on this plugin to rewrite them, while
    // `DatePicker.scss`/`DateRangePicker.scss` already prefix by hand (`var(--cx-primary)`) — an
    // inconsistent-but-working split across the component-scoped Sass, not a project-wide
    // convention this plugin merely guards.
    // `transformer: 'postcss'` is required to run PostCSS plugins at all — lightningcss (the
    // default) has no plugin API — and still handles final target lowering/minification per
    // `@tsdown/css`'s docs, so this doesn't give up that pass.
    transformer: 'postcss',
    postcss: {
      plugins: [postcssPrefixCustomProperties({ prefix: 'cx-', ignore: [/^--cx-/] })]
    },
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
