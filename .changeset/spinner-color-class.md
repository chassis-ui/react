---
'@chassis-ui/react': patch
---

`color` of `Spinner` colors the spinner. It rendered `fg-{color}`, which sets the text color, and a spinner of `@chassis-ui/css` draws from `--cx-spinner-color`: every spinner stayed the default color. The prop now renders `spinner-{color}`, as a whole class name.
