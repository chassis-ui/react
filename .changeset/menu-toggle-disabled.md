---
'@chassis-ui/react': patch
---

A disabled `MenuToggle` never opens its menu. `disabled` reached only the rendered element, and react-aria's trigger opened on a press and on Enter, Space and the arrow keys all the same. A `NavLink` or `<a>` root (the navbar pattern), or the default `Button` with `href`, opened on a click as well, and the default `<button>` on a `pointerdown`. The toggle now passes `disabled` to react-aria too.
