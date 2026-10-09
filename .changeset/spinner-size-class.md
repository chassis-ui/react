---
'@chassis-ui/react': patch
---

`size="sm"` of `Spinner` makes the spinner smaller. It rendered `spinner-border-sm` or `spinner-grow-sm`, which are not classes of `@chassis-ui/css`, so the prop had no effect in either build. It now renders `spinner-sm`, the class that sizes a spinner of both variants.
