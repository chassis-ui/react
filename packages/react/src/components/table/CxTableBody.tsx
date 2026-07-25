import { ReactElement } from 'react'
import { TableBody } from 'react-stately'

export interface CxTableBodyProps<T> {
  /**
   * `CxTableRow` elements, or a render function paired with `items` for dynamic row generation.
   */
  children: ReactElement | ReactElement[] | ((item: T) => ReactElement)
  /**
   * A list of row data objects, rendered via the function form of `children`.
   */
  items?: Iterable<T>
}

/**
 * Collection node, data-only — read by `CxTable` to build the table's row collection. Never
 * rendered directly.
 */
export const CxTableBody = TableBody as unknown as <T>(props: CxTableBodyProps<T>) => ReactElement
