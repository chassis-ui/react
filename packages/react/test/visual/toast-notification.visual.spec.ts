import { runVisualRegressionSuite } from './visualSuite'

// Scoped to toast/notification (see the enterprise migration plan's Phase 10 — grouped here as
// the second-highest-value target: both are transition-heavy (fade/show CSS classes toggled by
// `useTransitionState`), no DOM markup change to catch a regression via a vitest snapshot). A
// future family gets its own *.visual.spec.ts with its own title-prefix filter, rather than
// widening this one.
runVisualRegressionSuite('toast/notification visual regression', ['toast/', 'notification/'], {
  // Unlike a Popover or Tooltip story that is open on first render (settled from the start),
  // Toast and Notification play their entrance on mount, so every one of these stories goes
  // through a real `entering` phase rather than starting already-settled. It is spent at
  // opacity 0 with nothing transitioning, so no `transitionend` ends it: it lasts until the
  // timer `useTransitionState` sets from the element's transition duration, and
  // `animations: 'disabled'` doesn't shorten that. A screenshot taken before the timer fires
  // catches the mid-transition class instead of the final `show` one.
  // `useDismissibleTransition` applies `'show showing'` while entering/exiting
  // and only bare `'show'` once settled (see src/hooks/useDismissibleTransition.ts) — a plain
  // `.show` selector matches the entering class list too (it's just a substring token), so it
  // resolves at the *start* of the transition, not the end. `:not(.showing)` is what actually
  // waits for the settled state.
  waitFor: (page) => page.locator('.show:not(.showing)').first().waitFor()
})
