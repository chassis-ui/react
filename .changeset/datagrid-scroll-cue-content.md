---
'@chassis-ui/react': patch
---

`DataGrid`'s pinned-column scroll cue follows the content width (#102). It was computed on mount, on `scroll` and on a resize of the grid, so a column set that changed without either (a column added, a `defaultWidth` or a `pin` changed) left the `pin="end"` shadow in its previous state until the user scrolled. The grid observes its scroll content as well.
