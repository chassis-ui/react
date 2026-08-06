import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import dts from 'rollup-plugin-dts'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

// rollup-plugin-postcss (last published 2021, no newer major to move to) calls `sass.render()`
// to compile `.scss`/`.sass` imports — the legacy, callback-based Sass API, which prints a
// `[legacy-js-api]` deprecation warning on every build and disappears outright in Dart Sass 2.0.
// There's no plugin option to swap in the modern API, so instead we patch that one entry point,
// on the same `sass` module instance `rollup-plugin-postcss` itself loads (Node's `require` cache
// is keyed by resolved file path, so `require('sass')` below and rollup-plugin-postcss's own
// internal `require('sass')` return the identical object) — `render`'s legacy callback shape
// implemented on top of the modern, non-deprecated `compileString`, so its behavior (and the
// `use: { sass: { includePaths } }` config below) is unchanged, just without the deprecated call
// path that prints the warning. One real behavior gap: the legacy loader also special-cased a
// leading `~` (webpack's node-sass convention) on bare specifiers via a custom `importer`
// callback, which the modern API has no equivalent hook for and this patch doesn't replicate —
// unused today (no current `.scss` file has any `@use`/`@import` at all), but if one is ever
// added, write bare specifiers without the `~` (e.g. `@use '@chassis-ui/css/scss/config/index'`)
// — Dart Sass resolves those natively against `includePaths` above, `~` or not.
const sass = require('sass')
sass.render = (options, callback) => {
  try {
    const result = sass.compileString(options.data, {
      url: options.file ? pathToFileURL(options.file) : undefined,
      loadPaths: options.includePaths,
      syntax: options.indentedSyntax ? 'indented' : 'scss',
      sourceMap: Boolean(options.sourceMap)
    })
    callback(null, {
      css: result.css,
      map: result.sourceMap ? JSON.stringify(result.sourceMap) : undefined,
      stats: {
        includedFiles: result.loadedUrls
          .filter((url) => url.protocol === 'file:')
          .map((url) => fileURLToPath(url))
      }
    })
  } catch (error) {
    callback(error)
  }
}

export default [
  {
    input: 'src/index.ts',
    onwarn(warning, warn) {
      // @internationalized/date (a react-aria/react-stately dependency used by DatePicker) has
      // benign internal circular imports between its type modules. Silence just that noise so real
      // circular-dependency warnings in our own code stay visible.
      if (
        warning.code === 'CIRCULAR_DEPENDENCY' &&
        warning.ids?.every((id) => id.includes('@internationalized/date'))
      ) {
        return
      }
      // Rollup strips module-level directives ("use client") when bundling — expected, see the
      // `banner` on each output below, which re-adds it directly to the emitted files instead.
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
        return
      }
      warn(warning)
    },
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        // Rollup drops `src/index.ts`'s own `'use client'` directive when bundling (directives
        // aren't preserved across module concatenation) — re-added here as a literal banner so
        // it survives as the first line of the actual emitted file, which is what RSC-aware
        // bundlers (Next.js, etc.) scan for. Almost every component here uses react-aria hooks or
        // `forwardRef` (~90% of component files, audited 2026-08-05 — see Phase 7 of the
        // migration plan), so this is a whole-package client boundary, not a per-component one.
        banner: "'use client';",
        sourcemapPathTransform: (relativeSourcePath) => {
          return relativeSourcePath
            .replace('../../node_modules/', '../')
            .replace('../packages/react', '..')
        }
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
        banner: "'use client';",
        sourcemapPathTransform: (relativeSourcePath) => {
          return relativeSourcePath
            .replace('../../node_modules/', '../')
            .replace('../packages/react', '..')
        }
      }
    ],
    plugins: [
      // `includeDependencies: true` externalizes everything in `package.json`'s `dependencies`
      // too, not just `peerDependencies` (its default) — react-aria/react-stately/
      // react-transition-group/@internationalized/date/classnames are real runtime dependencies
      // (not devDependencies-only build tooling) and were previously getting bundled directly
      // into dist/ instead of resolved normally from a consumer's own node_modules, ballooning
      // bundle size and risking duplicate react-aria context instances if a consumer's app also
      // uses react-aria directly elsewhere.
      external({ includeDependencies: true }),
      resolve(),
      typescript({
        // Story files import `@storybook/react-vite` (a devDependency this build's tsconfig
        // doesn't type-check against, same reasoning as excluding `__tests__`) and are never
        // reachable from `src/index.ts` — excluding them keeps the build free of unreachable-file
        // type warnings.
        exclude: ['**/__tests__/**', '**/*.stories.tsx'],
        tsconfig: './tsconfig.json'
      }),
      commonjs({
        include: ['../../node_modules/**']
      }),
      // Components with no chassis-css visual equivalent (DatePicker's calendar grid) ship
      // their own scoped Sass, injected as a <style> tag on import — no separate stylesheet for
      // consumers to remember to include.
      postcss({
        inject: true,
        use: {
          sass: {
            // Two resolution gaps between how this repo writes `@use '~@chassis-ui/css/...'`
            // and what this loader resolves on its own (see the `sass.render` patch above for why
            // it's still this same legacy-shaped option, just running through the modern compiler
            // now):
            // - directory-partial imports need an explicit `/index` (this loader's
            //   directory-index convention looks for `index.<ext>`, not Sass's own `_index.<ext>`
            //   partial convention) — write `@use '~@chassis-ui/css/scss/config/index'`, not
            //   `.../scss/config`.
            // - `@chassis-ui/css`'s own `scss/config/_vendor.scss` forwards two bare specifiers
            //   that need an explicit load path to resolve: `@forward "chassis-tokens"` (resolved
            //   by including `node_modules/@chassis-ui/css/scss/vendor`, which has a matching
            //   `_chassis-tokens.scss`) and `@forward
            //   "@chassis-ui/tokens/dist/web/docs/chassis/main"` (resolved because `node_modules`
            //   + that literal specifier is a normal path lookup).
            includePaths: [
              path.resolve('./node_modules/@chassis-ui/css/scss/vendor'),
              path.resolve('./node_modules')
            ]
          }
        }
      })
    ]
  },
  {
    input: 'dist/src/index.d.ts',
    output: [{ file: pkg.types, format: 'es' }],
    external: [/\.css$/, /\.scss$/],
    plugins: [dts()]
  }
]
