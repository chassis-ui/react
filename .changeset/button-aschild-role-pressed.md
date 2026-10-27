---
'@chassis-ui/react': patch
---

`<Button asChild pressed>` around a link given `role="button"` now renders `aria-pressed`, as `<Button component="a" role="button" pressed>` does. That is the documented way to make a router link a toggle; `Button` looked for the role in its own props, where `asChild` never puts the child's, so the pressed state was not announced.
