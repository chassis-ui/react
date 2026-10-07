// chassis-css has `grid-rows-1` to `grid-rows-6`.
export const hasRowsClass = (rows: number | undefined) =>
  rows !== undefined && Number.isInteger(rows) && rows >= 1 && rows <= 6

// A row count with no class is the declaration of the class, set inline: see `Grid`'s `rows`.
// `grid-template-rows` isn't inherited, so unlike a custom property it stays on the one grid.
export const rowsTemplate = (rows: number | undefined): string | undefined =>
  rows !== undefined && !hasRowsClass(rows) ? `repeat(${rows}, minmax(0, 1fr))` : undefined
