import { runVisualRegressionSuite } from './visualSuite'

// Scoped to time-field: its segments share `DateSegment.scss` (compiled into dist/style.css — see
// THEMING.md's "Component-scoped CSS") with the date pickers, in a `.form-input` of their own. The
// stories set their locale and settle without transitions, so `animations: 'disabled'` is enough.
runVisualRegressionSuite('time-field visual regression', ['time-field/'])
