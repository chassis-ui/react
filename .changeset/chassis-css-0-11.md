---
'@chassis-ui/react': minor
---

Breaking: `@chassis-ui/css` 0.11 is required (the peer range is `>=0.11.0 <0.12.0`), and a project
that compiles its Sass needs `@chassis-ui/tokens` 0.10.1. No prop, export or class name of this
package changes; css 0.8 to 0.11 change how a page looks with no change of markup. Headings and the
title roles are set in Montserrat, the base colors of the default tokens are new, and buttons,
badges, chips, pagination links, progress bars and the other components that had one lose their
background gradient (`$enable-background-gradients: true` keeps it). The font family of
components is named `ui`: `.font-ui` and `--cx-font-family-ui`, where `.font-text` and
`--cx-font-family-text` are deprecated. `.h1` to `.h6` are deprecated for `.font-h1` to
`.font-h6`. An SVG icon in a `Link` with `iconLink` is drawn at `1em` of the link text instead of
`--cx-icon-size` (24 px with the default tokens); a size class such as `.icon-lg` on the icon makes
it larger. Blockquotes are Regular Italic instead of Light Italic. The changelogs of
`@chassis-ui/css` 0.8.0 to 0.11.0 have the full list.

- `style.css` is built with css 0.11 and reads the custom properties of the `ui` family, such as
  `--cx-font-family-ui`, `--cx-font-size-ui-sm` and `--cx-font-weight-ui-strong`, which css 0.7
  doesn't declare. The default of `--cx-divider-label-font-size` is `var(--cx-font-size-ui-sm)`,
  the size it had.
