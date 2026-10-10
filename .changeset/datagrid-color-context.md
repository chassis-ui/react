---
'@chassis-ui/react': patch
---

`color` of `DataGrid` colors the grid. It rendered the color class alone, which no rule of the grid's stylesheet reads, so a colored grid looked like one with no color. The prop now renders `context` beside the color, on the grid and on its `footer`, and `style.css` maps the context colors onto the grid as `@chassis-ui/css` does for a table. A hovered row takes the header's background, which is opaque, so that a pinned cell never shows the cells scrolled under it.
