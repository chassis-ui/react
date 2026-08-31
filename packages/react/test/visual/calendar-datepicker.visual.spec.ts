import { runVisualRegressionSuite } from './visualSuite'

// Scoped to the calendar/datepicker family for now (see the enterprise migration plan's Phase 4
// visual-regression item — Phase 2 touched this family's CSS output directly, and snapshot tests
// alone don't catch a visual regression there). A future family gets its own *.visual.spec.ts
// with its own title-prefix filter, rather than widening this one.
runVisualRegressionSuite('calendar/datepicker visual regression', ['calendar/', 'datepicker/'])
