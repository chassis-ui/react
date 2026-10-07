---
'@chassis-ui/react': minor
---

`Row` and `Col` are removed with the flexbox grid of `@chassis-ui/css` 0.7. `Grid` and `GridItem`
take what the grid of css 0.7 adds: row counts as a class, the flow, end lines and the container
breakpoints.

Breaking: `@chassis-ui/css` 0.7 is required (the peer range is `>=0.7.0 <0.8.0`), and a project
that compiles its Sass needs `@chassis-ui/tokens` 0.7. css 0.7 changes how a page looks with no
change of markup: the gap of a grid with no `gap` is 1rem, and 1.5rem from `md`, where it went from
0.5rem to 3rem; the padding of a `Container` is 1rem, and 1.5rem from `md`, where it was 0.75rem;
subtle text is less faint, and the context colors of the dark theme are lighter. The changelog of
`@chassis-ui/css` 0.7.0 has the full list.

- Breaking: `Row`, `Col`, `RowProps` and `ColProps` are removed. They were deprecated in 0.3.0, and
  css 0.7 has none of the classes they rendered. The Grid page of the docs maps each of their props
  to `Grid` and `GridItem` (Migrating from Row/Col).
- Breaking: `rows` of `Grid`, and of a `subgrid` `GridItem`, renders the `grid-rows-{n}` class for a
  count from 1 to 6, and sets `grid-template-rows` inline for any other. It set `--cx-grid-rows`,
  which css 0.7 removed, so on css 0.7 the prop of 0.3 does nothing. A grid with no `rows` no longer
  has one template row: its rows are as tall as their content. A grid nested in a grid with `rows`
  no longer takes that row count.
- Breaking: `<Grid fill>` with no `min` wraps. Its columns are at least 12rem wide in css 0.7, where
  every child shared one row. Set `min` for another width.
- Breaking: `start={13}` and `rowStart={7}` have no class in css 0.7, which stops the start lines
  at the last track. Place an item against the end edge with `end`: `span={3} end={13}`.
- `GridItem` takes `end` and `rowEnd`, a line number or `'auto'` (`col-end-{n}`, `row-end-{n}`), on
  the item and in `responsive`.
- `Grid` takes `flow`: `'row'`, `'column'`, `'dense'`, `'row-dense'` or `'column-dense'`, the values
  of CSS `grid-auto-flow`, rendered as the `grid-flow-*` classes. `flow="column"` fills the `rows`
  of a column before it starts the next. `responsive` takes `flow` and `rows` beside `columns` and
  `gap`. The `GridFlow` type is exported.
- `responsive` of `Grid` and `GridItem` takes the container keys `'@sm'` to `'@2xl'` beside the
  breakpoint keys: `responsive={{ '@md': { span: 4 } }}` renders `@md:col-span-4`, which follows
  the width of the nearest query container (an ancestor with the `contains-inline` class) where
  `md` follows the viewport. A container key wins over a breakpoint key where both apply. The
  `ContainerBreakpoint` type is exported.
- `Grid` takes `contained` (the `contained` class): its default gutter and column count follow the
  query container too.
- `Skeleton`: a `responsive` width of `12` or `'auto'` works. It renders `md:w-100` and
  `md:w-auto`, which css 0.7 has and css 0.6 lacked.
