---
"@chassis-ui/react": minor
---

`MenuToggle` accepts a new `component` prop to swap its trigger root away from the default `Button` — e.g. `<MenuToggle component={NavLink}>` renders a `.nav-link.caret` trigger (matching a `Navbar`'s other nav items) instead of `.button.caret`. Existing usage without `component` is unchanged; passing an override type-checks against that component's own props (`color`/`variant`/`shape`/`size` remain valid only for the default `Button` root).
