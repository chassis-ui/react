---
'@chassis-ui/react': patch
---

`DataGrid` no longer writes a `<style>` element for the shadow of its pinned columns. The HTML standard allows a `<style>` in `<body>` only with its rules in `@scope`, and an HTML validator reports the grid's markup since it checks that. The cells and the column header of the last `pin="start"` column and of the first `pin="end"` column now carry `datagrid-pin-cue-start` and `datagrid-pin-cue-end`, and `style.css` gives them the shadow while the grid is scrolled, from the same `--datagrid-pin-cue-shadow-start` and `--datagrid-pin-cue-shadow-end`. The grid loses the class made from `useId` (`datagrid-r…`) that scoped the generated rules.
