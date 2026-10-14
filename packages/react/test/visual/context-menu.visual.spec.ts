import { runVisualRegressionSuite, waitForStoryRender } from './visualSuite'

// Scoped to context-menu: it positions its list at the pointer, or under the region's start edge
// when `defaultVisible` opens it, and that placement is pixels no vitest DOM assertion can see.
// The items are `Menu`'s, which menu-popover-tooltip covers too. The list portals to
// `document.body`, which the page screenshot takes in. The `play` functions of `Default` and
// `StackedSubmenu` open the menu and close it again: wait for the story's render to finish.
//
// `StackedSubmenu` is written for a phone's width (`mobile1` in Storybook's viewports), where
// chassis-css replaces the list with the stacked submenu and its play function expects that.
runVisualRegressionSuite('context-menu visual regression', ['context-menu/'], {
  waitFor: waitForStoryRender,
  viewports: { 'context-menu-contextmenu--stacked-submenu': { width: 320, height: 568 } }
})
