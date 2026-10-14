---
'@chassis-ui/react': minor
---

`DataGrid`'s `pin="end"` columns are pinned inside the layout engine, from the column widths and positions it computes, instead of being measured from the page and moved by a `transform` afterwards.

- An end-pinned column that nothing pushes off the grid stays where the layout put it. In a grid whose columns fit, it was moved by the grid's width and drawn past the last column; after a column narrower than react-stately's 75px minimum, it was drawn past the edge.
- An end-pinned column is in the page at any scroll position. One further right than the grid's width plus about a third wasn't rendered until scrolled to.
- An end-pinned header is drawn over the headers that scroll under it. It was under every header to its left.
- `pin` is read off the column that has it, so columns in a fragment, a wrapper component or the `columns` render function of `DataGridHeader` pin as written. A header with a fragment pinned the wrong column, and the render-function form didn't pin to the end or get either scroll cue.
- Under RTL, the end-pinned column is pinned to the left edge, and the grid takes `datagrid-scrolled-start` once scrolled.
- Breaking: each scroll-cue shadow is on the edge content scrolls under, the trailing edge of the start group and the leading edge of the end group. They were on the outer edges. The defaults of `--datagrid-pin-cue-shadow-start` and `--datagrid-pin-cue-shadow-end` change to match, with a mirrored pair under `[dir="rtl"]`. A value of your own for either property is applied as before, on the edge its horizontal offset gives; to match the new default, flip the sign of that offset, and give `[dir="rtl"]` the opposite sign.
- In Firefox, a `pin="start"` header stays at the edge however often the grid is scrolled. After a couple of horizontal scrolls it scrolled away with the other columns.
