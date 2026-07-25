import { Key, ReactElement } from 'react'
import { Row } from 'react-stately'

export interface CxTableRowProps {
  /**
   * `CxTableCell` elements, or a render function called once per column with that column's key —
   * required when the row's parent `CxTableBody` uses the `items`/render-function form.
   */
  children: ReactElement | ReactElement[] | ((columnKey: Key) => ReactElement)
  /**
   * A string representation of the row's contents, used for typeahead.
   */
  textValue?: string
}

/**
 * Collection node, data-only — see `CxTableHeader`. Read by `CxTable` to build a row in the
 * table's collection; never rendered directly.
 */
export const CxTableRow = Row as unknown as (props: CxTableRowProps) => ReactElement
