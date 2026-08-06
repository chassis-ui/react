import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// @testing-library/dom's `waitFor` only self-advances fake timers when it detects a Jest
// environment (`typeof jest !== 'undefined'`), so it can call `jest.advanceTimersByTime` to
// drive its own polling loop. Vitest's fake timers are API-compatible with Jest's, but without
// this, waitFor takes the "real timers" branch and hangs forever waiting on a fake setInterval
// that nothing advances. https://github.com/testing-library/dom-testing-library/issues/830
declare global {
  var jest: typeof vi | undefined
}
globalThis.jest = vi
