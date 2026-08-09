---
"@chassis-ui/react": patch
---

**Fix:** `Container`'s `fluid` and `fluidUntil` props now generate the correct chassis-css classes.

They previously built a single hyphenated class (`container-fluid`, `container-medium`) and dropped the base `container` class entirely. Chassis-css actually styles these via compound selectors (`.container.fluid`, `.container.medium`), which never matched — so `<Container fluid>` and `<Container fluidUntil="...">` silently rendered with no fluid/breakpoint behavior at all. No prop API changes; only the emitted class names are fixed, now `container fluid` / `container medium` (etc.) as separate classes.
