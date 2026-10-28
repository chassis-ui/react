---
'@chassis-ui/react': minor
---

`NavItem` and `Pagination` put `className`, the ref and every other attribute on one element, as the other components do. `NavItem` gains `linkProps` for its link's own attributes, and `Pagination` gains `listClassName` for its `.pagination` list.

**Breaking:** a `NavItem` with a link now puts its attributes (`id`, `data-*`, `aria-*`, `style`, …) on its `<li>`, beside `className` and the ref; only `href`, `active`, `disabled`, `component`, `asChild` and `onClick` still go to the link, and anything else for it, such as `target` or a router link's `to`, moves to `linkProps`. `Pagination`'s `className` now goes to the `<nav>`, beside the ref and the other attributes; pass the list's classes as `listClassName`.
