---
'@chassis-ui/react': patch
---

`Grid` and `GridItem` render no class for a value `@chassis-ui/css` has no rule for, and warn in development (part of #116): a `span`, `start` or `end` past twelve columns, a `rowSpan`, `rowStart` or `rowEnd` past six rows, a breakpoint's `columns` or `rows` past them, and a count that isn't a whole number from 1 up (`rows={2.5}`), which set an invalid `repeat()` a browser drops. `GridItem` also warns for `rows` or `gap` without `subgrid`, which set nothing. The base `columns` of a `Grid` past twelve still falls back to `--cx-grid-columns`.
