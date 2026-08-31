import { runVisualRegressionSuite } from './visualSuite'

// Scoped to menu/popover/tooltip (see the enterprise migration plan's Phase 10 — grouped here as
// the highest-value first target: pure CSS-driven positioning, no DOM markup change to catch a
// regression via a vitest snapshot). A future family gets its own *.visual.spec.ts with its own
// title-prefix filter, rather than widening this one.
runVisualRegressionSuite('menu/popover/tooltip visual regression', [
  'menu/',
  'popover/',
  'tooltip/'
])
