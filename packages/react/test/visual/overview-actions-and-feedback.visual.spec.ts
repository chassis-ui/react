import { runVisualRegressionSuite } from './visualSuite'

// Scoped to the Actions and feedback overview (`stories/overview/ActionsAndFeedback.stories.tsx`):
// one page of the buttons, links and small status components, which apply `@chassis-ui/css`
// classes and have no styles or runtime layout of their own, so one screenshot of all of them
// catches a chassis-css change that moves any of them (#45). The page is taller than the viewport,
// so the screenshot takes the whole page. `animations: 'disabled'` cancels the spinners' and
// skeletons' infinite animations, which leaves each at its first frame.
runVisualRegressionSuite(
  'actions and feedback overview visual regression',
  ['overview/Actions and feedback'],
  { fullPage: true }
)
