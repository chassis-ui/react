---
"@chassis-ui/react": minor
---

`Badge` and `PaginationItem` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`.

`usePagination`'s default ref/element type changes from `HTMLAnchorElement` to `HTMLButtonElement`, matching `PaginationItem`'s new default `component` (previously `'button' | 'a'` depending on `href`/`active`, now consistently `'button'` unless overridden).
