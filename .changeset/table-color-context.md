---
'@chassis-ui/react': patch
---

`color` of `Table` and `StaticTable` colors the table. It rendered the color class alone (`table primary`), and `@chassis-ui/css` colors a table through `.table.context`: the table looked like one with no color. The prop now renders `context` beside the color.
