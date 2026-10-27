---
'@chassis-ui/react': patch
---

`DataGrid`'s `align` aligns the body cells' content (#101): `align="middle"` on a fixed `rowHeight` grid centres it, as `Table`'s `align` does. The prop set a `vertical-align` class on the grid alone, which reached none of the virtualizer's absolutely positioned cells. A cell under a grid with `align` renders its content in one `.datagrid-cell-content`, which the stylesheet places; the header row keeps its own alignment, as a table's does.
