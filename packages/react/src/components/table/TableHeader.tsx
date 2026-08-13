import { ReactElement } from 'react'
import { TableHeader as StatelyTableHeader } from 'react-stately'

export interface TableHeaderProps<T> {
  /**
   * `TableColumn` elements, or a render function paired with `columns` for dynamic column
   * generation.
   */
  children: ReactElement | ReactElement[] | ((column: T) => ReactElement)
  /**
   * A string of all className you want applied to the `<thead>` element.
   */
  className?: string
  /**
   * A list of column data objects, rendered via the function form of `children`.
   */
  columns?: readonly T[]
}

/**
 * Collection node, data-only — read by `Table` to build the table's column collection. Never
 * rendered directly.
 */
export const TableHeader = StatelyTableHeader as unknown as <T>(
  props: TableHeaderProps<T>
) => ReactElement
