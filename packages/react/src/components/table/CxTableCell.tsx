import { ReactElement, ReactNode } from 'react'
import { Cell } from 'react-stately'

export interface CTableCellProps {
  /**
   * The contents of the cell.
   */
  children: ReactNode
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
 * Collection node, data-only — see `CxTableHeader`. Read by `CxTable` to build a cell in the
 * table's collection; never rendered directly.
 */
export const CxTableCell = Cell as unknown as (props: CTableCellProps) => ReactElement
