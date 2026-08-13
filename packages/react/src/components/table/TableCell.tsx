import { ReactElement, ReactNode } from 'react'
import { Cell } from 'react-stately'

export interface TableCellProps {
  /**
   * The contents of the cell.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the cell.
   */
  className?: string
  /**
   * Indicates how many columns the cell spans.
   */
  colSpan?: number
  /**
   * A string representation of the cell's contents, used for typeahead.
   */
  textValue?: string
}

/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a cell in the
 * table's collection; never rendered directly.
 */
export const TableCell = Cell as unknown as (props: TableCellProps) => ReactElement
