import { runVisualRegressionSuite } from './visualSuite'

// Scoped to toast/notification (see the enterprise migration plan's Phase 10 — grouped here as
// the second-highest-value target: both are transition-heavy (fade/show CSS classes toggled by
// react-transition-group), no DOM markup change to catch a regression via a vitest snapshot). A
// future family gets its own *.visual.spec.ts with its own title-prefix filter, rather than
// widening this one.
runVisualRegressionSuite('toast/notification visual regression', ['toast/', 'notification/'], {
  // Unlike Popover/Tooltip (whose `Transition` `timeout.enter` is 0), Toast mounts with internal
  // state `false` and only syncs to the story's `visible: true` arg in a `useEffect` *after*
  // mount, so every one of these stories genuinely animates through a real 250ms `entering` phase
  // rather than starting already-settled. `animations: 'disabled'` zeroes CSS transition/animation
  // duration, but react-transition-group's own `entering` → `entered` state change is wall-clock-
  // timer-driven (`setTimeout`), not CSS — so a screenshot taken before that timer fires
  // intermittently catches the mid-transition class instead of the final `show` one.
  // `useDismissibleTransition.getTransitionClass` applies `'show showing'` while entering/exiting
  // and only bare `'show'` once settled (see src/hooks/useDismissibleTransition.ts) — a plain
  // `.show` selector matches the entering class list too (it's just a substring token), so it
  // resolves at the *start* of the transition, not the end. `:not(.showing)` is what actually
  // waits for the settled state.
  waitFor: (page) => page.locator('.show:not(.showing)').first().waitFor()
})
