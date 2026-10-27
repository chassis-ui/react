import React, { ReactNode, useContext } from 'react'
import { Key, Cell as AriaCell } from 'react-aria-components'
import classNames from 'classnames'

import { DataGridAlignContext } from './context'
import { PinCueElement } from './pinnedColumns'

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
}: DataGridCellProps) => {
  // Under a grid with `align`, the content is one element for the cell, a column flexbox then,
  // to place on the cross axis (`DataGrid.scss`): inline content keeps its flow inside it.
  const align = useContext(DataGridAlignContext)
  return (
    <AriaCell
      className={classNames('datagrid-cell', className)}
      colSpan={colSpan}
      id={id}
      render={(props, { columnIndex }) => (
        <PinCueElement {...(props as React.ComponentProps<'div'>)} columnIndex={columnIndex} />
      )}
      textValue={textValue}
    >
      {align ? <div className="datagrid-cell-content">{children}</div> : children}
    </AriaCell>
  )
}
