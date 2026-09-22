---
'@chassis-ui/react': patch
---

Fix `Radio`, `Checkbox` and `Switch` silently discarding `children`, which left the control with
no accessible name. `children` was never omitted from their props types (it comes in via
`InputHTMLAttributes`), so `<Radio value="a">Option A</Radio>` type-checked and rendered — and
then the implementation's `{ ...rest, children: label }` overwrote it with an undefined `label`,
so react-aria had nothing to build a name from and the visible text was dropped. A WCAG 4.1.2
failure that no type error, runtime warning or snapshot would catch; it only shows up in an
accessibility check or a query by accessible name.

`children` is now accepted as an alias for `label`, which is what react-aria calls the same thing
(`AriaRadioProps.children`) before this package renames it — so the shape React developers reach
for first names the control. `label` still wins when both are given. `Switch`'s radio-backed
variant (`type="radio"`) is fixed too: it spreads its rest props straight onto the `<input>`, so
children there did not merely vanish, they reached a void element and React threw.
