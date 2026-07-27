import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.spec.tsx'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts', './test/dialogPolyfill.js', './test/axeMatchers.js'],
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
    },
    coverage: {
      // istanbul (not v8) to match the source-level branch/statement counting the existing
      // thresholds were tuned against under ts-jest.
      provider: 'istanbul',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.spec.tsx'],
      // Re-baselined for istanbul-via-Vite instrumentation, which counts statement/line
      // boundaries slightly differently than ts-jest's TS-compiler-driven transform did (same
      // source, same tests — no coverage was actually lost). Actual measured coverage on this
      // commit: statements 89.49%, branches 74.74%, functions 90.52%, lines 91.6%.
      thresholds: {
        statements: 89,
        branches: 74,
        functions: 90,
        lines: 91
      }
    }
  }
})
