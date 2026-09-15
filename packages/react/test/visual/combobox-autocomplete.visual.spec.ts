import { runVisualRegressionSuite } from './visualSuite'

// Scoped to combobox/autocomplete: both portal their listbox to `document.body` and position it
// with `useOverlayPosition` (see Combobox.tsx/Autocomplete.tsx), the same pure-CSS-positioning,
// no-DOM-markup-change risk profile as the existing menu/popover/tooltip family — kept as its own
// spec file rather than widening that one, per this repo's own convention.
//
// Unlike Menu/Popover/DatePicker, neither component has a `visible`/`defaultOpen`-style prop to
// force its listbox open declaratively, so the `OpenMenu` story in each drives a real click in its
// `play` function instead (see the comment on each). Every other story here never opens its
// listbox at all. `waitFor` below tolerates both: it looks for an open listbox for up to 2s and
// swallows the timeout when one never appears, rather than making every non-opening story pay a
// fixed wait or letting a genuinely-slow-to-open story race the screenshot.
runVisualRegressionSuite(
  'combobox/autocomplete visual regression',
  ['combobox/', 'autocomplete/'],
  {
    waitFor: (page) =>
      page
        .locator('[role="listbox"]')
        .first()
        .waitFor({ state: 'visible', timeout: 2000 })
        .catch(() => {})
  }
)
