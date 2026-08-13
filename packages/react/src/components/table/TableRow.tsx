import { Key, ReactElement } from 'react'
import { Row } from 'react-stately'

export interface TableRowProps {
  /**
   * `TableCell` elements, or a render function called once per column with that column's key —
   * required when the row's parent `TableBody` uses the `items`/render-function form.
   */
  children: ReactElement | ReactElement[] | ((columnKey: Key) => ReactElement)
  /**
   * A string of all className you want applied to the row.
   */
  className?: string
  /**
   * A string representation of the row's contents, used for typeahead.
   */
  textValue?: string
}

/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a row in the
 * table's collection; never rendered directly.
 */
export const TableRow = Row as unknown as (props: TableRowProps) => ReactElement
