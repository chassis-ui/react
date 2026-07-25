import { ReactElement, ReactNode } from 'react'
import { Column } from 'react-stately'

export interface CTableColumnProps {
  /**
   * Whether the column allows sorting. Adds a sort indicator and makes the header
   * clickable/keyboard-activatable.
   */
  allowsSorting?: boolean
  /**
   * Rendered contents of the column header.
   */
  children: ReactNode
}

/**
 * Collection node, data-only — see `CxTableHeader`. Read by `CxTable` to build a column in the
 * table's collection; never rendered directly.
 */
export const CxTableColumn = Column as unknown as (props: CTableColumnProps) => ReactElement
