import React, { ReactElement, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaCheckboxProps,
  Key,
  useCheckbox,
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableHeaderRow,
  useTableRow,
  useTableRowGroup,
  useTableSelectAllCheckbox,
  useTableSelectionCheckbox
} from 'react-aria'
import {
  Selection,
  SortDescriptor,
  TableBodyProps,
  TableHeaderProps,
  TableState,
  useTableState,
  useToggleState
} from 'react-stately'

import { ContextColor } from '../../types'
import './Table.css'

// `GridNode<T>` (from `@react-types/shared`) isn't re-exported by either package's public
// surface — derived from the hooks' own parameter types instead of adding an undeclared
// dependency on react-aria/react-stately's shared internals package.
type ColumnNode<T> = Parameters<typeof useTableColumnHeader<T>>[0]['node']
type RowNode<T> = Parameters<typeof useTableRow<T>>[0]['node']
type CellNode<T> = Parameters<typeof useTableCell<T>>[0]['node']

export interface TableProps<T extends object> {
  /**
   * An accessible label for the table, used when there's no visible heading.
   */
  'aria-label'?: string
  /**
   * Identifies a visible heading element for the table.
   */
  'aria-labelledby'?: string
  /**
   * Set the vertical alignment of cell content.
   */
  align?: 'bottom' | 'middle' | 'top'
  /**
   * Add borders on all sides of the table and cells.
   */
  bordered?: boolean
  /**
   * Remove borders on all sides of the table and cells.
   */
  borderless?: boolean
  /**
   * Content shown above the table, functioning as a heading for it.
   */
  caption?: ReactNode
  /**
   * A `TableHeader` and a `TableBody`, each built from `TableColumn`/`TableRow`/
   * `TableCell` — read as data to build the table's collection. Not rendered directly.
   */
  children: [ReactElement<TableHeaderProps<T>>, ReactElement<TableBodyProps<T>>]
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component.
   */
  color?: ContextColor
  /**
   * A list of row keys to disable. Disabled rows cannot be selected, focused, or interacted with.
   */
  disabledKeys?: Iterable<Key>
  /**
   * Content shown below the table in a `<tfoot>`, e.g. a totals row. Rendered as plain markup —
   * not part of the keyboard-navigable grid.
   */
  footer?: ReactNode
  /**
   * Enable a hover state on table rows.
   */
  hover?: boolean
  /**
   * `id` forwarded to the table element.
   */
  id?: string
  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Selection) => void
  /**
   * Handler that is called when a column is sorted.
   */
  onSortChange?: (descriptor: SortDescriptor) => void
  /**
   * Make any table responsive across all viewports or pick a maximum breakpoint.
   */
  responsive?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * The currently selected row keys (controlled).
   */
  selectedKeys?: Selection
  /**
   * The type of selection that is allowed.
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * Make table more compact by cutting all cell padding.
   */
  small?: boolean
  /**
   * The current sort column and direction.
   */
  sortDescriptor?: SortDescriptor
  /**
   * Add zebra-striping to table rows.
   */
  striped?: boolean
}

export const Table = <T extends object>({
  align,
  bordered,
  borderless,
  caption,
  children,
  className,
  color,
  disabledKeys,
  footer,
  hover,
  id,
  onSelectionChange,
  onSortChange,
  responsive,
  selectedKeys,
  selectionMode = 'none',
  small,
  sortDescriptor,
  striped,
  ...rest
}: TableProps<T>) => {
  const state = useTableState<T>({
    children,
    disabledKeys,
    onSelectionChange,
    onSortChange,
    selectedKeys,
    selectionMode,
    showSelectionCheckboxes: selectionMode === 'multiple',
    sortDescriptor
  })

  const ref = useRef<HTMLTableElement>(null)
  const { gridProps } = useTable(
    { 'aria-label': rest['aria-label'], 'aria-labelledby': rest['aria-labelledby'], id },
    state,
    ref
  )

  const _className = classNames(
    'table',
    color,
    {
      [`align-${align}`]: align,
      bordered,
      borderless,
      hoverable: hover,
      small,
      striped
    },
    className
  )

  const tableEl = (
    <table {...gridProps} className={_className || undefined} ref={ref}>
      {caption && <caption>{caption}</caption>}
      <TableRowGroup type="thead">
        {state.collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...(state.collection.getChildren?.(headerRow.key) ?? [])].map((column) =>
              column.props?.isSelectionCell ? (
                <TableSelectAllCell key={column.key} column={column} state={state} />
              ) : (
                <TableColumnHeader key={column.key} column={column} state={state} />
              )
            )}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup type="tbody">
        {[...state.collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...(state.collection.getChildren?.(row.key) ?? [])].map((cell) =>
              cell.props?.isSelectionCell ? (
                <TableSelectionCell key={cell.key} cell={cell} state={state} />
              ) : (
                <TableCell key={cell.key} cell={cell} state={state} />
              )
            )}
          </TableRow>
        ))}
      </TableRowGroup>
      {footer && <tfoot>{footer}</tfoot>}
    </table>
  )

  if (!responsive) return tableEl

  return (
    <div
      className={
        typeof responsive === 'boolean' ? 'table-responsive' : `table-responsive-${responsive}`
      }
    >
      {tableEl}
    </div>
  )
}

Table.displayName = 'Table'

const TableRowGroup = ({
  type: Element,
  children
}: {
  children: ReactNode
  type: 'thead' | 'tbody'
}) => {
  const { rowGroupProps } = useTableRowGroup()
  return <Element {...rowGroupProps}>{children}</Element>
}

interface TableHeaderRowProps<T> {
  children: ReactNode
  item: RowNode<T>
  state: TableState<T>
}

const TableHeaderRow = <T extends object>({ children, item, state }: TableHeaderRowProps<T>) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref)
  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  )
}

interface TableColumnHeaderProps<T> {
  column: ColumnNode<T>
  state: TableState<T>
}

const TableColumnHeader = <T extends object>({ column, state }: TableColumnHeaderProps<T>) => {
  const ref = useRef<HTMLTableCellElement>(null)
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref)
  const sortActive = state.sortDescriptor?.column === column.key
  const sortIcon = state.sortDescriptor?.direction === 'ascending' ? '▲' : '▼'

  return (
    <th {...columnHeaderProps} colSpan={column.colSpan ?? undefined} ref={ref}>
      {column.rendered}
      {column.props?.allowsSorting && (
        <span aria-hidden="true" className="table-sort-icon">
          {sortActive ? sortIcon : '⇅'}
        </span>
      )}
    </th>
  )
}

interface TableSelectAllCellProps<T> {
  column: ColumnNode<T>
  state: TableState<T>
}

const TableSelectAllCell = <T extends object>({ column, state }: TableSelectAllCellProps<T>) => {
  const ref = useRef<HTMLTableCellElement>(null)
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref)
  const { checkboxProps } = useTableSelectAllCheckbox(state)

  return (
    <th {...columnHeaderProps} className="table-selection-cell" ref={ref}>
      <TableCheckbox checkboxProps={checkboxProps} />
    </th>
  )
}

interface TableRowProps<T> {
  children: ReactNode
  item: RowNode<T>
  state: TableState<T>
}

const TableRow = <T extends object>({ children, item, state }: TableRowProps<T>) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const { rowProps } = useTableRow({ node: item }, state, ref)
  const isSelected = state.selectionManager.isSelected(item.key)

  return (
    <tr {...rowProps} className={classNames({ active: isSelected })} ref={ref}>
      {children}
    </tr>
  )
}

interface TableCellProps<T> {
  cell: CellNode<T>
  state: TableState<T>
}

const TableCell = <T extends object>({ cell, state }: TableCellProps<T>) => {
  const ref = useRef<HTMLTableCellElement>(null)
  const { gridCellProps } = useTableCell({ node: cell }, state, ref)

  return (
    <td {...gridCellProps} ref={ref}>
      {cell.rendered}
    </td>
  )
}

const TableSelectionCell = <T extends object>({ cell, state }: TableCellProps<T>) => {
  const ref = useRef<HTMLTableCellElement>(null)
  const { gridCellProps } = useTableCell({ node: cell }, state, ref)
  const { checkboxProps } = useTableSelectionCheckbox({ key: cell.parentKey! }, state)

  return (
    <td {...gridCellProps} className="table-selection-cell" ref={ref}>
      <TableCheckbox checkboxProps={checkboxProps} />
    </td>
  )
}

const TableCheckbox = ({ checkboxProps }: { checkboxProps: AriaCheckboxProps }) => {
  const toggleState = useToggleState(checkboxProps)
  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckbox(checkboxProps, toggleState, ref)

  return <input {...inputProps} className="check-input" ref={ref} />
}
