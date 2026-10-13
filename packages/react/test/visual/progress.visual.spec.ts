import { runVisualRegressionSuite } from './visualSuite'

// Scoped to progress: `Progress.scss` (compiled into dist/style.css — see THEMING.md's
// "Component-scoped CSS") draws the indeterminate bar, which a vitest DOM assertion can't see.
// `animations: 'disabled'` cancels an infinite animation, and a cancelled sweep leaves a plain
// full bar, which is not a state the stylesheet ever shows. The indeterminate stories are taken
// under reduced motion instead, where the bar is still by design.
runVisualRegressionSuite('progress visual regression', ['progress/'], {
  waitFor: async (page) => {
    if (page.url().includes('--indeterminate')) {
      await page.emulateMedia({ reducedMotion: 'reduce' })
    }
  }
})
