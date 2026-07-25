import { ReactElement } from 'react'
import { TableHeader } from 'react-stately'

export interface CxTableHeaderProps<T> {
  /**
   * `CxTableColumn` elements, or a render function paired with `columns` for dynamic column
   * generation.
   */
  children: ReactElement | ReactElement[] | ((column: T) => ReactElement)
  /**
   * A list of column data objects, rendered via the function form of `children`.
   */
  columns?: readonly T[]
}

/**
 * Collection node, data-only — read by `CxTable` to build the table's column collection. Never
 * rendered directly.
 */
export const CxTableHeader = TableHeader as unknown as <T>(
  props: CxTableHeaderProps<T>,
) => ReactElement
