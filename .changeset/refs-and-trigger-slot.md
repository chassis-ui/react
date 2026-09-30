---
'@chassis-ui/react': minor
---

Every component that renders an element of its own now forwards a ref.

- `Autocomplete`: to the toggle, the `.combobox` element, as `Combobox` does.
- `PasswordStrength`: to the meter. It reached it before only by accident, and TypeScript rejected
  it.
- `FormField`: to the `.form-field` element. `null` while the field renders its children bare,
  with no `label`, `help`, feedback or `className`.
- `SkeletonLoader`: to the first generated skeleton while `loading`, `null` once the content
  shows.

`Tooltip` and `Popover` render their trigger the way `asChild` renders a child. A trigger's own
`aria-describedby` now keeps the tooltip's description beside it instead of losing to it, and a
trigger that isn't exactly one element renders as it is, with a development warning, instead of
throwing. The trigger's own handlers now run after the component's, as under `asChild`.

Under `asChild`, a child's own `aria-describedby` adds to the component's instead of replacing it.
