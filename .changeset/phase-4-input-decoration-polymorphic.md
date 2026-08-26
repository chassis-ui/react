---
"@chassis-ui/react": minor
---

`InputAdorn` and `InputGroupAddon` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`. `InputAdorn` previously accepted only a hand-picked subset of anchor/button props (`href`, `rel`, `target`, `type`) via `Pick` — that subset was already missing props like `disabled`/`download`; the generic pattern now infers the full, correct prop set for whatever `component` is passed, with autocomplete and type-checking at the call site.

`InputGroup` gains a `component` prop (previously a plain, unconfigurable `div` wrapper), using the same pattern.
