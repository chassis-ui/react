import { runVisualRegressionSuite } from './visualSuite'

// Scoped to the Layout and content overview (`stories/overview/LayoutAndContent.stories.tsx`): one
// page of the layout primitives and content containers, which apply `@chassis-ui/css` classes and
// have no styles or runtime layout of their own, so one screenshot of all of them catches a
// chassis-css change that moves any of them, its spacing tokens above all (#45). The page is taller
// than the viewport, so the screenshot takes the whole page. It is static: no play function, no
// transition, nothing focused.
runVisualRegressionSuite(
  'layout and content overview visual regression',
  ['overview/Layout and content'],
  { fullPage: true }
)
