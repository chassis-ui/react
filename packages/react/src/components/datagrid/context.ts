import { createContext } from 'react'

/**
 * The grid's `align`, read by `DataGridCell`: with one set, a cell renders its content in one
 * `.datagrid-cell-content` for `DataGrid.scss` to place (see the `align` rule there).
 */
export const DataGridAlignContext = createContext<'bottom' | 'middle' | 'top' | undefined>(
  undefined
)
