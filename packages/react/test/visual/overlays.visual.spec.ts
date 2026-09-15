import { runVisualRegressionSuite } from './visualSuite'

// Scoped to modal/drawer: both are native-<dialog>-backed, transition-heavy overlays (open/close
// CSS classes driven by `useDialogElement`, see Modal.tsx/Drawer.tsx) with no DOM markup change a
// vitest snapshot could catch a regression in. A future family gets its own *.visual.spec.ts with
// its own title-prefix filter, rather than widening this one.
//
// Every story that renders open does so via the `visible: true` arg, which `useDialogElement`
// resolves synchronously on the very first render (`useState(visible)`, no mount-then-effect
// flip like Toast/Notification) — so, same as calendar/datepicker's static "Open" stories, there
// is no post-mount timer to wait out here and `animations: 'disabled'` alone is enough.
runVisualRegressionSuite('modal/drawer visual regression', ['modal/', 'drawer/'])
