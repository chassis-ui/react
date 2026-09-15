import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

// `import.meta.dirname`, not `__dirname`: Vite's `configLoader: 'native'` (planned to become the
// default) can't provide the CommonJS global and warned about it on every single test run.
const dirname = import.meta.dirname

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  css: {
    // Same resolution gap `tsdown.config.ts`'s build config and `.storybook/main.ts`'s
    // `viteFinal` close: component .scss files that `@use "@chassis-ui/css/scss/..."` directly
    // (e.g. DatePicker, Calendar, RangeCalendar) need this to resolve `@chassis-ui/css`'s own
    // bare-specifier `@forward`s (`chassis-tokens`, `@chassis-ui/tokens/...`).
    preprocessorOptions: {
      scss: {
        loadPaths: [
          path.resolve(dirname, 'node_modules/@chassis-ui/css/scss/vendor'),
          path.resolve(dirname, 'node_modules')
        ]
      }
    }
  },
  test: {
    coverage: {
      // istanbul (not v8) to match the source-level branch/statement counting the existing
      // thresholds were tuned against under ts-jest.
      provider: 'istanbul',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      // Storybook story files are never executed by this test suite (Playwright's own visual
      // tests exercise them separately, against a built Storybook, not through vitest) — counting
      // them here would drag coverage down purely from being unexecuted, not undertested. Spec
      // files now live entirely under test/, outside this src/**-scoped coverage.include glob,
      // so there's nothing under src/ left to exclude for them.
      exclude: ['**/*.stories.tsx'],
      // Re-baselined against what the suite actually covers, which had drifted a long way above
      // these numbers: the previous thresholds (statements 91, branches 79, functions 93,
      // lines 93) sat 6-14 points below reality, so branch coverage could have fallen by a
      // seventh before anything failed. Measured on the jsdom project alone — statements 97.20%,
      // branches 92.82%, functions 98.26%, lines 98.78% — deliberately *not* on the full run,
      // so the gate means the same thing whether or not the `storybook` browser project ran
      // (it contributes only 0.1-0.5 points on top: 97.30/93.36/98.26/98.81 combined).
      // Roughly a point of slack under those so an ordinary refactor doesn't fail the build;
      // re-baseline again, upward, if real coverage moves.
      thresholds: {
        statements: 96,
        branches: 91,
        functions: 97,
        lines: 97
      }
    },
    projects: [
      {
        extends: true,
        test: {
          include: ['test/**/*.spec.tsx'],
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./test/setup.ts', './test/dialogPolyfill.ts', './test/axeMatchers.ts'],
          // Jest's "modern" fake timers (the prior runner) fake requestAnimationFrame by default;
          // Vitest's don't. react-aria's hover/press interactions schedule state updates via rAF, so
          // without this, `vi.useFakeTimers()` + `vi.runAllTimers()` never flushes them.
          fakeTimers: {
            toFake: [
              'setTimeout',
              'clearTimeout',
              'setInterval',
              'clearInterval',
              'setImmediate',
              'clearImmediate',
              'Date',
              'requestAnimationFrame',
              'cancelAnimationFrame'
            ]
          }
        }
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          // Also switches react-stately's Virtualizer back on — it renders every row unwindowed
          // under `NODE_ENV === 'test'` otherwise, which crashed this project's DataGrid stories.
          // See the file's own comment; it can't be a Vite `define`, which leaks across projects.
          setupFiles: ['./test/processPolyfill.ts'],
          browser: {
            enabled: true,
            headless: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provider: playwright({}) as any,
            instances: [
              {
                browser: 'chromium'
              }
            ]
          }
        }
      }
    ]
  }
})
