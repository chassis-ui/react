import { act } from '@testing-library/react'
import { configure, getConfig } from '@testing-library/dom'

// `@testing-library/react`'s `asyncWrapper` config (shared with `waitFor`) explicitly sets
// `IS_REACT_ACT_ENVIRONMENT` to `false` for the duration of any call routed through it - and every
// top-level `userEvent` method (`.click`, `.tab`, `.keyboard`, ...) is one of those calls, via its
// own internal `wrapAsync`. That's intentional for `waitFor` (so its polling doesn't nag about
// updates it's deliberately observing outside `act`), but it's an unrelated side effect for
// `userEvent`: react-aria hooks (e.g. `useOverlayPosition`) that schedule a state update mid-
// interaction land while the flag is force-false, logging "The current testing environment is not
// configured to support act(...)" even though the whole interaction is already wrapped in `act()`
// here. Swapping in a no-op `asyncWrapper` only around the `userEvent` call - never touching the
// global config outside this scope - keeps `waitFor` elsewhere in the suite unaffected.
export async function actUserEvent(interaction: () => Promise<unknown>): Promise<void> {
  const previousAsyncWrapper = getConfig().asyncWrapper
  configure({ asyncWrapper: async (cb) => cb() })
  try {
    await act(async () => {
      await interaction()
    })
  } finally {
    configure({ asyncWrapper: previousAsyncWrapper })
  }
}
