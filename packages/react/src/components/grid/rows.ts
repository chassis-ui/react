import { GRID_ROWS, isCount } from './limits'

// chassis-css has `grid-rows-1` to `grid-rows-6`.
export const hasRowsClass = (rows: number | undefined) => isCount(rows, GRID_ROWS)

// A row count with no class is the declaration of the class, set inline: see `Grid`'s `rows`.
// `grid-template-rows` isn't inherited, so unlike a custom property it stays on the one grid. A
// count that isn't one (`2.5`) is left out: `repeat(2.5, …)` is invalid, and a browser drops it.
export const rowsTemplate = (rows: number | undefined): string | undefined =>
  isCount(rows) && !hasRowsClass(rows) ? `repeat(${rows}, minmax(0, 1fr))` : undefined
