import { ReactElement } from 'react'
import { TableBody as StatelyTableBody } from 'react-stately'

export interface TableBodyProps<T> {
  /**
   * `TableRow` elements, or a render function paired with `items` for dynamic row generation.
   */
  children: ReactElement | ReactElement[] | ((item: T) => ReactElement)
  /**
   * A string of all className you want applied to the `<tbody>` element.
   */
  className?: string
  /**
   * A list of row data objects, rendered via the function form of `children`.
   */
  items?: Iterable<T>
}

/**
 * Collection node, data-only — read by `Table` to build the table's row collection. Never
 * rendered directly.
 */
export const TableBody = StatelyTableBody as unknown as <T>(
  props: TableBodyProps<T>
) => ReactElement
