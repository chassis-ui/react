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
