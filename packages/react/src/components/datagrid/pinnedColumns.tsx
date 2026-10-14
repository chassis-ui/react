import React, { useContext } from 'react'
import classNames from 'classnames'
import { TableStateContext } from 'react-aria-components'

export type ColumnPin = 'start' | 'end'

/**
 * A column's `pin`, read off the resolved collection. `DataGridColumn` passes `pin` through to
 * react-aria-components' `Column`, whose collection builder keeps the props it is given, so it
 * reaches `column.props.pin` however the header was written: static children, fragments, a
 * wrapper component or the `columns` render function.
 */
export const getColumnPin = (
  column: { props?: unknown } | null | undefined
): ColumnPin | undefined => {
  const pin = (column?.props as { pin?: unknown } | undefined)?.pin
  return pin === 'start' || pin === 'end' ? pin : undefined
}

/**
 * The scroll-cue class of a column: `datagrid-pin-cue-start` on the last `pin="start"` column,
 * `datagrid-pin-cue-end` on the first `pin="end"` one, the boundary of each pinned group.
 * `DataGrid.scss` gives it the shadow while the grid carries `datagrid-scrolled-start`/
 * `datagrid-scrolled-end`. A class on the cell and a rule in the stylesheet, not a `<style>`
 * element written per grid: the HTML standard allows a `<style>` in `<body>` only with its rules
 * in `@scope`, which the browsers this package supports don't all have.
 */
const usePinCueClassName = (columnIndex: number | null | undefined): string => {
  const columns = useContext(TableStateContext)?.collection.columns
  if (columnIndex == null || !columns) return ''
  let start: number | null = null
  let end: number | null = null
  columns.forEach((column, index) => {
    const pin = getColumnPin(column)
    if (pin === 'start') start = index
    else if (pin === 'end' && end == null) end = index
  })
  if (columnIndex === start) return 'datagrid-pin-cue-start'
  if (columnIndex === end) return 'datagrid-pin-cue-end'
  return ''
}

/**
 * The element react-aria-components renders for a column header's or a cell's `render`, with the
 * scroll-cue class of its column added. A component, so the table state is read where the element
 * really renders: `DataGridColumn` and `DataGridCell` themselves also run in the pass that builds
 * the collection, which has no table state yet, and their render props are kept from that pass.
 */
export const PinCueElement = ({
  columnIndex,
  ...props
}: React.ComponentProps<'div'> & { columnIndex: number | null | undefined }) => {
  const pinCueClassName = usePinCueClassName(columnIndex)
  return <div {...props} className={classNames(props.className, pinCueClassName) || undefined} />
}
