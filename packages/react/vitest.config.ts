import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

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
      // Re-baselined after the CxButton-pattern test modernization pass (see the plan at
      // .claude/plans/abstract-snacking-tome.md): behavioral coverage across the suite pushed
      // real numbers up from the ts-jest-era baseline (statements 89.49%, branches 74.74%,
      // functions 90.52%, lines 91.6%) to the current statements 91.53%, branches 79.37%,
      // functions 93.15%, lines 93.56%.
      thresholds: {
        statements: 91,
        branches: 79,
        functions: 93,
        lines: 93
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
