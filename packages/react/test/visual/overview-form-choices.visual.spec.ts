import { runVisualRegressionSuite } from './visualSuite'

// Scoped to the Form choices and fields overview (`stories/overview/FormChoices.stories.tsx`): one
// page of the choice controls and the form scaffolding, which apply `@chassis-ui/css` classes and
// have no styles or runtime layout of their own, so one screenshot of all of them catches a
// chassis-css change that moves any of them (#45). The page is taller than the viewport, so the
// screenshot takes the whole page. It is static: no play function, no transition, nothing focused.
runVisualRegressionSuite(
  'form choices and fields overview visual regression',
  ['overview/Form choices and fields'],
  { fullPage: true }
)
