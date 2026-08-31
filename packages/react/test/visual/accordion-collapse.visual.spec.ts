import { runVisualRegressionSuite } from './visualSuite'

// Scoped to accordion/collapse (see the enterprise migration plan's Phase 10 — the third
// candidate group: native <details>/CSSTransition-driven open-close state, no DOM markup change
// to catch a regression via a vitest snapshot). A future family gets its own
// *.visual.spec.ts with its own title-prefix filter, rather than widening this one.
//
// Neither family has a post-mount timer to wait out here (see the comments in
// Accordion.stories.tsx / Collapse.stories.tsx for why) — both render their final state on first
// paint, so `animations: 'disabled'` alone is enough, same treatment as calendar/datepicker's
// static stories.
runVisualRegressionSuite('accordion/collapse visual regression', ['accordion/', 'collapse/'])
