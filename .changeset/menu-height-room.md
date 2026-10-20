---
'@chassis-ui/react': patch
---

The list of a `Menu`, `MenuSubmenu`, `ContextMenu`, `Combobox` or `Autocomplete` is no taller than the room beside its trigger, and scrolls inside it. Since 0.5.0 it took its height from `--cx-menu-max-height` alone, which is `none` for a `Menu`, so a menu taller than the room on either side of its trigger ran off the viewport, and the items past the edge could not be reached. The list now takes the smaller of `--cx-menu-max-height` and the room react-aria finds for it, as before 0.5.0, and the theme's cap still wins where it is the smaller one: a `Combobox` list stays at 320px. Where the room is the limit, the list gets `overflow-y: auto`.
