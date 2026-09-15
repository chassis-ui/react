import { runVisualRegressionSuite } from './visualSuite'

// Scoped to DataGrid, the first family whose rendering is virtualizer-driven (react-aria-components'
// Virtualizer computing row position/size at runtime, not CSS alone) — exactly the kind of thing a
// screenshot catches that a DOM-structure unit test can't (e.g. a row height/offset regression that
// still passes every role/attribute assertion). A future family gets its own *.visual.spec.ts with
// its own title-prefix filter, rather than widening this one.
//
// Unlike calendar/datepicker's static stories, a wait is needed here: `DataGrid`'s own scroll-cue
// classes (`datagrid-scrolled-start`/`-end`, see DataGrid.tsx) and `DataGridPinBehavior`'s pin="end"
// positioning both read the grid's `scrollWidth`/`clientWidth` from a `useEffect`, but those values
// don't settle to their real, laid-out numbers until the browser's own layout/paint cycle catches
// up with React's commit (they still read as equal — no overflow, as if nothing needs scrolling —
// for the first frame or two even when every column has a static pixel width). A screenshot taken
// in that window doesn't just look transiently wrong, it's genuinely different from one taken a
// couple of frames later, which is exactly the kind of instability
// `expect(page).toHaveScreenshot()` retries against — caught in practice as a "Pinned Columns"
// baseline that failed to stabilize (a real, non-zero pixel diff between two back-to-back
// captures) the first time this family's Linux baselines were generated. Waiting two animation
// frames after navigation, mirroring the same fix applied inside PinnedColumnsScrolled/
// HeaderFooterScrolled's own mount effects in DataGrid.stories.tsx for the identical reason, gives
// that settling time to complete before the screenshot is taken.
runVisualRegressionSuite('datagrid visual regression', ['datagrid/'], {
  waitFor: (page) =>
    page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        })
    )
})
