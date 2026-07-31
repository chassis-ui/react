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
      // @internationalized/date (a react-aria/react-stately dependency used by CxDatePicker) has
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
      // Components with no chassis-css visual equivalent (CxDatePicker's calendar grid) ship
      // their own scoped CSS, injected as a <style> tag on import — no separate stylesheet for
      // consumers to remember to include.
      postcss({
        inject: true
      })
    ]
  },
  {
    input: 'dist/src/index.d.ts',
    output: [{ file: pkg.types, format: 'es' }],
    external: [/\.css$/],
    plugins: [dts()]
  }
]
