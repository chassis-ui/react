---
'@chassis-ui/react': minor
---

Three additions for server-rendered apps and accessible markup:

- `Portal` renders its children into `document.body` or a `container` you give, and renders
  `fallback` (nothing by default) on the server and during hydration, so a server-rendered page
  hydrates without a mismatch. It is what the library's own overlays use.
- `useHydrated()` is `false` on the server and during hydration, `true` after, for rendering what
  only the browser knows.
- `VisuallyHidden` renders chassis-css's `.visually-hidden` (a `<span>` by default, with
  `component` and `asChild`), or `.visually-hidden-focusable` with `focusable`, for a skip link.

Each is also a subpath: `@chassis-ui/react/portal` and `@chassis-ui/react/visually-hidden`.
