---
"@chassis-ui/react": minor
---

`Stepper` and `StepperItem` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`. `Stepper`'s data-driven default (`'ol'`, switching to `'div'` when a step is interactive, and propagating that to plain `StepperItem` children) is unchanged — only the prop typing changes.
