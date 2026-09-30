import { runVisualRegressionSuite } from './visualSuite'

// Scoped to divider: `Divider.scss` (compiled into dist/style.css — see AGENTS.md's Build section)
// draws the line on elements other than `<hr>`, the vertical line and the label, none of which a
// vitest DOM assertion can see. The stories are static, so `animations: 'disabled'` is enough.
runVisualRegressionSuite('divider visual regression', ['divider/'])
