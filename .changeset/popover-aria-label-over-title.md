---
'@chassis-ui/react': patch
---

A `Popover` with a `title` and an `aria-label` of the caller's is named by the `aria-label`, as a `Modal` or `Drawer` is. The panel kept the title's `aria-labelledby` beside it, which outranks `aria-label`, so the caller's name was ignored. The title still shows.
