---
'@chassis-ui/react': patch
---

Export every component's prop types from the package entry point.

`ButtonProps`, `TableProps`, `MenuItemDef`, `Placement`, the shared scales (`ContextColor`,
`Sizing`, `Spacing`, ...) and the public hooks' result types were all declared but never exported,
so `import type { ButtonProps } from '@chassis-ui/react'` failed and consumers had to re-derive
them with `ComponentProps<typeof Button>`. All 164 type names the component barrels already
export are now reachable from the package root.

As a side effect, `TableBodyProps`/`TableHeaderProps` are no longer emitted under `$1`-suffixed
names in `dist/index.d.ts` — now that this package exports its own, react-stately's same-named
types are the ones that get suffixed instead.
