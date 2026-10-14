import { runVisualRegressionSuite, waitForStoryRender } from './visualSuite'

// Scoped to nav-overflow: it measures its container and its items to decide which items move into
// the overflow menu, so what the row shows depends on chassis-css's spacing and type, which no
// vitest DOM assertion can see (jsdom lays nothing out). Every story renders at a fixed width, so
// what fits doesn't depend on the viewport. The measuring settles a frame or two after the first
// render, and several `play` functions open the menu and close it again, or pick a tab from it:
// wait for the story's render to finish.
runVisualRegressionSuite('nav-overflow visual regression', ['nav-overflow/'], {
  waitFor: waitForStoryRender
})
