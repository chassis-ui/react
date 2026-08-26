---
"@chassis-ui/react": minor
---

`Navbar`, `NavbarNav`, and `NavbarBrand` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`. `NavbarBrand`'s existing `component`-takes-precedence-over-`href` behavior is preserved exactly, now expressed through the generic pattern.

`NavbarText` gains a new `component` prop (previously a plain, unconfigurable `span` wrapper), using the same pattern.
