---
'@chassis-ui/react': minor
---

Add `Divider`: the line chassis-css draws with its reboot's `<hr>`, and with `.vr` when
`orientation="vertical"`. Children become a label in the line ("or" between two ways to sign in),
placed with `labelPlacement` (`start`, `center`, `end`), which names the separator for screen
readers. An `<hr>` by default, a `<div role="separator">` when vertical or labelled; `component`
and `asChild` render any other element as the separator. Also a subpath: `@chassis-ui/react/divider`.

The label, the vertical line and the line on elements other than `<hr>` are in
`@chassis-ui/react/style.css`. The color, thickness, opacity and margin of the line, and the color,
size and gap of the label, are custom properties (`--cx-divider-color`, `--cx-divider-size`, ...),
defaulting to chassis-css's values for `<hr>` and `.vr`; a divider inside a menu takes the menu's.

Also: `@chassis-ui/react/style.css` now opens with chassis-css's layer order, so it works imported
before or after chassis-css's stylesheet. And under `asChild`, an element's own `aria-label` keeps
naming it where the component would name it with `aria-labelledby`.
