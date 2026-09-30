---
'@chassis-ui/react': minor
---

Every component that takes `href` follows one rule: it renders an `<a>` when `href` is set, unless
`component` or `asChild` chose the element, and `href` reaches only an element that can take it.

- `ListItem` and `StepperItem` render an `<a>` for `href` alone. They used to stay an `<li>` with an
  `href` attribute and no link. `List` and `Stepper` render a `<div>` around such an item in place
  of the `<ul>` or `<ol>`, as they already did for `component="a"`.
- `CloseButton` renders an `<a>` for `href` alone. It used to drop `href` unless `component="a"` was
  passed as well.
- `MenuItem` without `href` renders a `<button type="button">`, which chassis-css styles as
  `.menu-item` too. It used to render an `<a>` with no `href`, which can't take focus.
- A router link passed as `component` gets `href` from `PaginationItem` and `CloseButton`. They used
  to drop it.
- A router link passed as `component` with `href` (or `to`) is handled as a link, as it already was
  as the `asChild` element. When disabled, it gets `aria-disabled` and `tabindex="-1"` and its click
  is blocked; it used to stay focusable and navigate, and `Button`, `Avatar` and `CloseButton` wrote
  an invalid `disabled` attribute onto the `<a>`. `ListItem` gets `list-action`, `CloseButton` its
  classes, and `List` and `Stepper` render a `<div>` around such an item.
- `href` is no longer written onto an element that can't take one: `component="div"` or
  `component="button"` on `Button`, `Chip`, `Avatar`, `NavbarBrand`, `Link` and the components built
  on it. The component warns in development instead.
- `Nav` no longer puts `role="navigation"` on its `<ul>`, which took away the list's semantics. Put
  a `<nav>` around it for the landmark.
- `NavItem` renders its `NavLink` for `component` or `asChild` as well as `href`. Without a link it
  no longer writes `active`, `disabled` or `component` onto its `<li>` as attributes.
- `Avatar` no longer writes a `disabled` attribute onto its `<span>`.
- `MenuToggle` with `href` renders `<a role="button">` without a `type`, and `component="button"`
  renders a `<button>` without a redundant `role`.

The ref types of `ListItem`, `StepperItem`, `CloseButton` and `MenuItem` accept the element `href`
switches to, as `Button`'s already did.
