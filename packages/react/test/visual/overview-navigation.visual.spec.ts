import { runVisualRegressionSuite, waitForStoryRender } from './visualSuite'

// Scoped to the Navigation overview (`stories/overview/Navigation.stories.tsx`): one page of the
// navigation components, which apply `@chassis-ui/css` classes and have no styles or runtime
// layout of their own, so one screenshot of all of them catches a chassis-css change that moves
// any of them (#45). The page is taller than the viewport, so the screenshot takes the whole page.
// A tab panel mounts and then fades in: wait for the story's render to finish.
runVisualRegressionSuite('navigation overview visual regression', ['overview/Navigation'], {
  waitFor: waitForStoryRender,
  fullPage: true
})
