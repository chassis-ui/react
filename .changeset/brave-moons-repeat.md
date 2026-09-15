---
'@chassis-ui/react': patch
---

Fix `Pagination` dropping keyboard focus every time the page changes.

`PaginationItem` rendered the active item as a `<span>`, so activating a page unmounted the focused
`<button>` and mounted a different element in its place — focus fell to `<body>` and a keyboard user
had to tab in from the top of the document again (WCAG 2.4.3). The active item now keeps whatever
element it would render anyway (`<button>`, or `<a>` when given `href`), so the element identity is
stable across activation. The `<span>` wasn't inert either: smart mode passes an `onClick`, so it
picked up `role="button"` and `tabIndex={0}` — a synthetic button in place of the real one.

`aria-current="page"` also moved from the wrapping `<li>` onto the control itself, which is where
the WAI-ARIA pagination pattern puts it and where a screen reader conveys it when focus lands.
Styling is unchanged: chassis-css matches `.pagination-link { &.active, .active > & }` and `active`
still lands on the `<li>`.
