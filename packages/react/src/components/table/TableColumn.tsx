import { ReactElement, ReactNode } from 'react'
import { Column } from 'react-stately'

export interface TableColumnProps {
  /**
   * Whether the column allows sorting. Adds a sort indicator and makes the header
   * clickable/keyboard-activatable.
   */
  allowsSorting?: boolean
  /**
   * Rendered contents of the column header.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the column header.
   */
  className?: string
}

/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a column in the
 * table's collection; never rendered directly.
 */
export const TableColumn = Column as unknown as (props: TableColumnProps) => ReactElement
