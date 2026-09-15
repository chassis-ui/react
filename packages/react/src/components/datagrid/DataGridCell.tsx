import React, { ReactNode } from 'react'
import { Key, Cell as AriaCell } from 'react-aria-components'
import classNames from 'classnames'

export interface DataGridCellProps {
  /**
   * The contents of the cell.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the cell.
   */
  className?: string
  /**
   * Indicates how many columns the cell spans.
   */
  colSpan?: number
  /**
   * The unique id of the cell.
   */
  id?: Key
  /**
   * A string representation of the cell's contents, used for typeahead.
   */
  textValue?: string
}

/**
 * A cell within a `DataGrid` row. Unlike `Table`'s sub-parts, this renders directly — it's a
 * thin wrapper over react-aria-components' own `Cell`.
 */
export const DataGridCell = ({
  children,
  className,
  colSpan,
  id,
  textValue
}: DataGridCellProps) => (
  <AriaCell
    className={classNames('datagrid-cell', className)}
    colSpan={colSpan}
    id={id}
    textValue={textValue}
  >
    {children}
  </AriaCell>
)
