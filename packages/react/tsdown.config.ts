import fs from 'fs'
import path from 'path'
import { defineConfig } from 'tsdown'
import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties'

// One entry per component folder, published as `@chassis-ui/react/<folder>` (`exports: true`
// below turns every entry into a subpath export), alongside the root `index` entry that re-exports
// all of them. A consumer importing from a subpath only pulls in that folder's module graph,
// instead of the whole library — see RSC.md's "Subpath imports" for why a single entry couldn't
// be tree-shaken by the consumer's bundler. Every folder's `index.ts` barrel carries its own
// `'use client'` directive, since Rolldown only preserves directives on entry modules.
const componentEntries = Object.fromEntries(
  fs
    .readdirSync('src/components', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => [dirent.name, `src/components/${dirent.name}/index.ts`])
)

export default defineConfig({
  entry: { index: 'src/index.ts', ...componentEntries },
  format: 'esm',
  dts: true,
  platform: 'neutral',
  // Explicit, not inferred. tsdown derives a target from `package.json`'s `engines.node` when one
  // is present, which silently made this browser library emit for `node24.0.0` — an unrelated
  // field that also happened to make `npm install` fail for consumers under engine-strict, so it
  // was removed. `es2022` matches the `browserslist` floor now declared alongside it (Chrome 107 /
  // Edge 107 / Firefox 104 / Safari 16 — the same "baseline widely available" set Vite targets).
  target: 'es2022',
  inputOptions: {
    treeshake: {
      // `package.json`'s `sideEffects` field describes the published `dist/` files, and Rolldown
      // applies it to this package's own `src/` modules too — none of which match it, so every
      // source module counts as side-effect-free and a bare
      // `import './utils/suppressFocusRingGlobally'` is silently dropped. The single-file build
      // masked that (the module was bundled anyway, because `RangeCalendar`/`focusRedirect`
      // import its `suppressFocusRing` export); split into chunks, a page using only `Button`
      // would have lost the global listener. Declared here so it's scoped to the build rather
      // than claimed in the published `sideEffects` for `src/`.
      moduleSideEffects: [{ test: /suppressFocusRingGlobally/, sideEffects: true }]
    }
  },
  outputOptions: {
    // Code shared between entries lands here, not next to the entries — keeps `dist/*.js` meaning
    // "an entry point", which `package.json`'s `sideEffects` globs rely on (see AGENTS.md's Build).
    chunkFileNames: 'chunks/[name]-[hash].js',
    codeSplitting: {
      // Its own chunk under a stable, un-hashed-prefix name, so `package.json`'s `sideEffects` can
      // name it (`./dist/chunks/focus-ring-*.js`) — bundlers must keep this chunk even though
      // nothing reads an export from it, while every other chunk stays tree-shakeable.
      groups: [{ name: 'focus-ring', test: /suppressFocusRingGlobally/ }]
    }
  },
  exports: true,
  publint: true,
  // Published dist is what every consumer downloads — minify the JS/CSS output instead of
  // shipping it pretty-printed. `dts` isn't affected: tsdown bundles declarations through a
  // separate pass that this flag doesn't touch, so the emitted `.d.ts` files stay readable.
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
  }
})
