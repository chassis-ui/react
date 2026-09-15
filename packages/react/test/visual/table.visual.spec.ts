import { runVisualRegressionSuite } from './visualSuite'

// Scoped to table: it has its own component-scoped CSS (Table.css, compiled into dist/style.css
// alongside Calendar/DatePicker/Notification — see AGENTS.md's Build section), so a regression in
// it can't be caught by a vitest DOM snapshot the way a plain chassis-css className change could.
// A future family gets its own *.visual.spec.ts with its own title-prefix filter, rather than
// widening this one.
//
// `Sorting`/`RowSelection` each drive a real interaction in their `play` function (a header
// click, a checkbox click) before settling into their final state — both are synchronous state
// updates with no CSS transition or wall-clock timer involved, so there is no post-mount timer to
// wait out here and `animations: 'disabled'` alone is enough, same as the other static stories.
runVisualRegressionSuite('table visual regression', ['table/'])
