---
"@chassis-ui/react": minor
---

`AccordionBody`, `ButtonGroup`, `ButtonToolbar`, `Progress`, and `ProgressBar` gain a new `component` prop (previously plain, unconfigurable `div` wrappers), using the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern. For `Progress`, `component` applies to the `role="progressbar"` element (the one `ref` already targets) — the outer caption-layout wrapper rendered when `label`/`showValue` is set stays a fixed `div`.
