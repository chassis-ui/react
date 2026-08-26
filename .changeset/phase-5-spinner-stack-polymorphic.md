---
"@chassis-ui/react": minor
---

`Spinner` and `Stack` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`. Both were already the plainest possible wrappers (no ARIA role logic, no conditional default), so this is a purely mechanical migration — no behavior change.
