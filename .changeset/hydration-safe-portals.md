---
'@chassis-ui/react': patch
---

Fix hydration errors from portaled overlays. `Combobox` and `Autocomplete` always failed to hydrate,
as did `FormField` around a `Combobox` and a `Popover` open on first render: their overlay was
portaled on the client's first render but not on the server. Every portal (`Combobox`,
`Autocomplete`, `Popover`, `Tooltip`, `Menu`'s `container`, `MenuSubmenu`, and `Toaster` with
`placement`) now renders nothing on the server and during hydration, and portals once hydration
has finished. A `Toaster` with `placement` no longer renders inline on the server.
