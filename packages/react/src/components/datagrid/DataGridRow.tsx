import React, { ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import { Key, Row as AriaRow } from 'react-aria-components'

export interface DataGridRowProps<T> {
  /**
   * `DataGridCell` elements, or a render function called once per column with that column's
   * data — required when the row's parent `DataGridBody` uses the `items`/render-function form.
   */
  children: ReactNode | ((column: T) => ReactElement)
  /**
   * A string of all className you want applied to the row.
   */
  className?: string
  /**
   * A list of column data objects, rendered via the function form of `children`.
   */
  columns?: Iterable<T>
  /**
   * The unique id of the row, referenced by `selectedKeys`/`disabledKeys`.
   */
  id?: Key
  /**
   * A string representation of the row's contents, used for typeahead.
   */
  textValue?: string
}

/**
 * A row within `DataGrid`. Unlike `Table`'s sub-parts, this renders directly — it's a thin
 * wrapper over react-aria-components' own `Row`.
 */
export const DataGridRow = <T extends object>({
  children,
  className,
  columns,
  id,
  textValue
}: DataGridRowProps<T>) => (
  <AriaRow
    className={classNames('datagrid-row', className)}
    columns={columns}
    id={id}
    textValue={textValue}
  >
    {children}
  </AriaRow>
)
