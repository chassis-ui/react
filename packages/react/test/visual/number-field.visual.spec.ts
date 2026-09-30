import { runVisualRegressionSuite } from './visualSuite'

// Scoped to number-field: `NumberField.scss` (compiled into dist/style.css — see AGENTS.md's Build
// section) draws the step buttons over the field's padding, which no vitest DOM assertion can see.
// The stories settle without transitions, so `animations: 'disabled'` is enough.
runVisualRegressionSuite('number-field visual regression', ['number-field/'])
