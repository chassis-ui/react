---
'@chassis-ui/react': patch
---

Fix components that read their children when those children are written in a React Server
Component.

- `Tabs` rendered an empty tab list, `List` and `Stepper` rendered an `<a>` directly inside
  `<ul>`/`<ol>`, and `Combobox` and `Autocomplete` listed no options. In a Server Component a
  client component's element carries a lazy wrapper as its type, so the components didn't
  recognize their own parts. This happened in production builds.
- `asChild` rendered the component's default element around the child and failed hydration, and
  `Tooltip` and `Popover` threw "Cannot read properties of undefined (reading 'ref')", when the
  child held something still loading, such as a client component passed by reference (#37). This
  happened under `next dev`.
- An icon element passed to `IconProvider` or to a component's icon prop could throw the same way.

A component that reads a child now waits for it when it is still loading, as a lazy component
does. `Table` still can't be composed in a Server Component; use `StaticTable` there.
