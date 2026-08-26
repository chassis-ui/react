---
"@chassis-ui/react": minor
---

`DrawerTitle` now uses the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`.

`DrawerBody`, `DrawerFooter`, and `DrawerHeader` gain a new `component` prop (previously plain, unconfigurable `div` wrappers), using the same pattern.
