---
'@chassis-ui/react': patch
---

Fix published types and package metadata that were wrong for consumers.

- `usePagination`'s `prevRef`/`nextRef` are typed `RefObject<T | null>`, matching the
  `useRef<T>(null)` they actually come from. They were declared non-null, so `prevRef.current.focus()`
  type-checked and then threw before mount.
- The polymorphic components that pick their element from `href` rather than `component` —
  `Button`, `Chip`, `Avatar`, `NavbarBrand`, `PaginationItem` — accept a `ref` covering the elements
  they can actually render. `<Button href="/x" ref={anchorRef}>` was a type error even though the
  runtime populated that ref with the `<a>` it rendered.
- Dropped the `engines` field. This is a browser library with no Node runtime requirement, and
  `engines.node: '>=24'` warned on install for consumers on older Node and hard-failed under
  `engine-strict`. It also drove the build's output target; the build now pins `es2022` explicitly,
  alongside a new `browserslist` field documenting the supported floor (Chrome 107+, Edge 107+,
  Firefox 104+, Safari 16+).
- `sideEffects` now lists `dist/` paths. It named a `src/` path no consumer resolves, so the whole
  published bundle was flagged side-effect-free while actually carrying the global focus-ring
  listener install.
- The published bundle carries exactly one `'use client'` directive; it previously carried two.
