import { runVisualRegressionSuite } from './visualSuite'

// Scoped to carousel — a CSS-scroll-snap-driven family (see AUDIT-PLAN.md's Phase 9), exactly the
// class of bug DOM snapshots can't catch (pixel-identical markup, broken layout). A future family
// gets its own *.visual.spec.ts with its own title-prefix filter, rather than widening this one.
//
// No story here enables autoplay, and the scroll-sync effect's very first pass is always forced
// instant rather than animated (see Carousel.tsx's own comment on `scrollSyncedRef`) — every story
// renders its final, settled state on first paint, so `animations: 'disabled'` alone is enough,
// same treatment as accordion/collapse's static stories.
runVisualRegressionSuite('carousel visual regression', ['carousel/'])
