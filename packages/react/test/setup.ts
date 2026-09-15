import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'

import { resetDevWarnings } from '../src/utils/devWarning'

// `devWarning`/`devError` de-duplicate on the message so a render-time misuse warning can't spam
// the console once per render. That set is module-level, so without clearing it between tests the
// second test in a file to trigger the same message would observe no warning at all.
beforeEach(() => {
  resetDevWarnings()
})

// @testing-library/dom's `waitFor` only self-advances fake timers when it detects a Jest
// environment (`typeof jest !== 'undefined'`), so it can call `jest.advanceTimersByTime` to
// drive its own polling loop. Vitest's fake timers are API-compatible with Jest's, but without
// this, waitFor takes the "real timers" branch and hangs forever waiting on a fake setInterval
// that nothing advances. https://github.com/testing-library/dom-testing-library/issues/830
declare global {
  var jest: typeof vi | undefined
}
globalThis.jest = vi
