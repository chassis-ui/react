---
'@chassis-ui/react': minor
---

`Grid` and `GridItem` are the grid of the library, on the CSS grid of `@chassis-ui/css` 0.6. `Row`
and `Col` are deprecated with the flexbox grid they render.

Breaking: `@chassis-ui/css` 0.6 is required (the peer range is `>=0.6.0 <0.7.0`). The components
below render classes that 0.5 does not have, so on 0.5 a `GridItem` is one track wide and a
`Skeleton` with a `span` has no width. In css 0.6 the gap of a grid with no `gap` is the gutter of
the breakpoint, from 0.5rem on a phone to 3rem on the widest screens, where it was 1.5rem.

- `GridItem` renders `col-span-{n}` and `col-start-{n}`, where it rendered `g-col-{n}` and
  `g-start-{n}`. `span="full"` spans the row (`col-span-full`): an item with no `span` is one track
  wide, so a column that stacks below a breakpoint is `span="full" responsive={{ md: { span: 6 } }}`.
  `start="auto"` returns an item to the flow at a wider breakpoint. `rowSpan` and `rowStart` place
  it on the rows (`row-span-{n}`, `row-start-{n}`). `responsive` takes all four.
- `Grid` takes `responsive`, as `Flex` does: `columns` at a breakpoint renders `grid-cols-{n}` (1
  to 12) and `gap` renders `gap-{token}`. The `GridLayout` type is exported.
- Breaking: `columns` from 1 to 12 renders the `grid-cols-{n}` class on `Grid`, where it set
  `--cx-grid-columns`. The grid has the same columns. A grid nested in it no longer inherits the
  count, as it did through the custom property: a `Grid` inside `<Grid columns={1}>` has its own
  12 columns again. A count with no class (13 and up) still sets `--cx-grid-columns`.
- Breaking: a `Spacing` token in `gap` renders the `gap-{token}` class on `Grid` and on a `subgrid`
  item, where it set `--cx-grid-gap` to the token's custom property. The gap is the same. A grid
  nested in it no longer inherits it, since a class is not inherited as the custom property was:
  give a nested grid, and a `subgrid` item, the `gap` of its own. A raw value (`gap="1rem"`) still
  sets `--cx-grid-gap`.
- `Grid fill` takes `min`, the minimum column width (`--cx-grid-min`), below which the children
  wrap. Its raw `gap` sets `--cx-grid-gap`, where it set `--cx-gap`.
- `Skeleton` and `SkeletonLoader` take the same `span`, `responsive` and `spans` values and render
  width utilities where they rendered the classes of the flexbox grid: `w-{n}/12` for a count,
  `w-100` for 12, `w-auto` for `'auto'` and `flex-fill` for `true`. The widths are the same. At a
  breakpoint, 12 and `'auto'` render `{breakpoint}:w-100` and `{breakpoint}:w-auto`, which
  `@chassis-ui/css` 0.6.0 does not have: in `responsive`, use a count up to 11, or `true`.
- `Row` and `Col` still render `.row` and `.col-*` and work as before. They are marked
  `@deprecated` and warn once in development. `@chassis-ui/css` removes its flexbox grid in 0.7,
  and they go with it.

To move from `Row` and `Col`:

| Before                                                | After                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| `<Row>`                                               | `<Grid>`, with no `Container` needed around it                     |
| `<Col span={4}>`                                      | `<GridItem span={4}>`                                              |
| `<Col span={12}>`                                     | `<GridItem span="full">`                                           |
| `<Col span={12} responsive={{ md: { span: 6 } }}>`    | `<GridItem span="full" responsive={{ md: { span: 6 } }}>`          |
| `<Col span={4} offset={2}>`                           | `<GridItem span={4} start={3}>`, exact for the first item of a row |
| `<Col order="first">`                                 | `<GridItem className="order-first">`                               |
| `<Row>` with bare `<Col>`s, equal columns             | `<Grid fill>` with plain children                                  |
| `<Row cols={3}>` with bare `<Col>`s                   | `<Grid columns={3}>` with plain children                           |
| `<Row cols={1} responsive={{ md: { cols: 3 } }}>`     | `<Grid columns={1} responsive={{ md: { columns: 3 } }}>`           |
| `<Row gutter="md">`                                   | `<Grid gap="md">`                                                  |
| `gutterX`, `gutterY`                                  | `className="column-gap-{token}"`, `className="row-gap-{token}"`    |
| `<Col span="auto">`, columns as wide as their content | `<Flex gap="md">` with plain children                              |
