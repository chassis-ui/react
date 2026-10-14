import { runVisualRegressionSuite, waitForStoryRender } from './visualSuite'

// Scoped to alert: an alert dialog, a `<dialog role="alertdialog">` opened with `showModal()` by
// the same `useDialogElement` as modal/drawer, with open/close transitions and a backdrop, none of
// which a vitest DOM assertion can see. The open stories open through `defaultVisible`, which
// `useDialogElement` acts on once the dialog is mounted: wait for the story's render to finish.
runVisualRegressionSuite('alert visual regression', ['alert/'], { waitFor: waitForStoryRender })
