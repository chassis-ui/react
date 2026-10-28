---
'@chassis-ui/react': minor
---

`Table`, `StaticTable` and `DataGrid` with `sm` now render compact, with half the cell padding: chassis-css has no size modifier for a table, so the `.sm` rule ships in this package's `style.css`. Before, `sm` rendered a class nothing styled.

**Breaking:** `Drawer` no longer renders a `nonmodal` class, and `NavTitle` no longer renders `nav-title`. chassis-css styles neither (its `.nonmodal` applies to `.dialog` only). A stylesheet that targets either class should select the drawer by `.drawer:not(:modal)` and the title by a class of its own passed through `className`.
