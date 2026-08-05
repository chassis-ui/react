import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import dts from 'rollup-plugin-dts'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')
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
      warn(warning)
    },
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
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
        sourcemapPathTransform: (relativeSourcePath) => {
          return relativeSourcePath
            .replace('../../node_modules/', '../')
            .replace('../packages/react', '..')
        }
      }
    ],
    plugins: [
      external(),
      resolve(),
      typescript({
        exclude: ['**/__tests__/**'],
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
            // and what the bundled (legacy API) sass loader resolves on its own:
            // - directory-partial imports need an explicit `/index` (this loader's
            //   directory-index convention looks for `index.<ext>`, not Sass's own `_index.<ext>`
            //   partial convention) — write `@use '~@chassis-ui/css/scss/config/index'`, not
            //   `.../scss/config`.
            // - `@chassis-ui/css`'s own `scss/config/_vendor.scss` forwards two bare specifiers
            //   legacy dart-sass can't resolve on its own: `@forward "chassis-tokens"` (resolved
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
