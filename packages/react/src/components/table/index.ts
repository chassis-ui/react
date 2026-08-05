import { Table as TableRoot } from './Table'
import { TableBody } from './TableBody'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
// plop:sub-import

export const Table = Object.assign(TableRoot, {
  // plop:sub-entry
  Body: TableBody,
  Cell: TableCell,
  Column: TableColumn,
  Header: TableHeader,
  Row: TableRow
})
export type { TableProps } from './Table'
export type { TableBodyProps } from './TableBody'
export type { TableCellProps } from './TableCell'
export type { TableColumnProps } from './TableColumn'
export type { TableHeaderProps } from './TableHeader'
export type { TableRowProps } from './TableRow'
// plop:sub-type
