---
"@chassis-ui/react": minor
---

`ModalTitle` now uses the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`.

`ModalBody`, `ModalFooter`, and `ModalHeader` gain a new `component` prop (previously plain, unconfigurable `div` wrappers), using the same pattern.
