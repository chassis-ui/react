---
"@chassis-ui/react": minor
---

`Flex`, `Grid`, and `GridItem` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`.

`Container` gains a new `component` prop (previously a plain, unconfigurable `div` wrapper), using the same pattern. `Row`/`Col` are unchanged — out of scope, not flagged as polymorphic candidates.
