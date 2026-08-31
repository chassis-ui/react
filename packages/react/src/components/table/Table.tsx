import React, { ReactElement, ReactNode, Ref, forwardRef, useRef } from 'react'
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

import { useForkedRef } from '../../hooks/useForkedRef'
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
  children: [
    ReactElement<TableHeaderProps<T> & { className?: string }>,
    ReactElement<TableBodyProps<T> & { className?: string }>
  ]
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
   * Convert rows into stacked label/value blocks below a container width, for tables with too
   * many columns to read comfortably even with horizontal scrolling. `true` always stacks; a
   * breakpoint name stacks only below it. Implies `responsive` when `responsive` isn't set
   * separately, since stacking needs the same `.table-responsive` container-query ancestor.
   * Labels come from each `TableColumn`'s text (or its `textValue`, for non-text headers).
   */
  stacked?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * Add zebra-striping to table rows.
   */
  striped?: boolean
}

const TableInner = <T extends object>(
  {
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
    stacked,
    striped,
    ...rest
  }: TableProps<T>,
  forwardedRef: Ref<HTMLTableElement>
) => {
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

  const internalRef = useRef<HTMLTableElement>(null)
  const ref = useForkedRef(internalRef, forwardedRef)
  const { gridProps } = useTable(
    { 'aria-label': rest['aria-label'], 'aria-labelledby': rest['aria-labelledby'], id },
    state,
    internalRef
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
      stacked: stacked === true,
      striped
    },
    typeof stacked === 'string' ? `max-${stacked}:stacked` : undefined,
    className
  )

  const tableEl = (
    <table {...gridProps} className={_className || undefined} ref={ref}>
      {caption && <caption>{caption}</caption>}
      <TableRowGroup className={children[0].props.className} type="thead">
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
      <TableRowGroup className={children[1].props.className} type="tbody">
        {[...state.collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...(state.collection.getChildren?.(row.key) ?? [])].map((cell) =>
              cell.props?.isSelectionCell ? (
                <TableSelectionCell key={cell.key} cell={cell} state={state} />
              ) : (
                <TableCell key={cell.key} cell={cell} stacked={!!stacked} state={state} />
              )
            )}
          </TableRow>
        ))}
      </TableRowGroup>
      {footer && <tfoot>{footer}</tfoot>}
    </table>
  )

  if (!responsive && !stacked) return tableEl

  const wrapperClassName = responsive
    ? typeof responsive === 'boolean'
      ? 'table-responsive'
      : `max-${responsive}:table-responsive`
    : 'table-responsive'

  return <div className={wrapperClassName}>{tableEl}</div>
}

// `forwardRef` erases type parameters, so the generic component is cast back to a generic
// signature for callers — same reasoning as `TableHeader`/`TableBody`'s casts above.
export const Table = forwardRef(TableInner) as <T extends object>(
  props: TableProps<T> & { ref?: Ref<HTMLTableElement> }
) => ReactElement

;(Table as { displayName?: string }).displayName = 'Table'

const TableRowGroup = ({
  className,
  type: Element,
  children
}: {
  children: ReactNode
  className?: string
  type: 'thead' | 'tbody'
}) => {
  const { rowGroupProps } = useTableRowGroup()
  return (
    <Element {...rowGroupProps} className={className || undefined}>
      {children}
    </Element>
  )
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
    <th
      {...columnHeaderProps}
      className={column.props?.className || undefined}
      colSpan={column.colSpan ?? undefined}
      ref={ref}
    >
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
    <tr
      {...rowProps}
      className={classNames({ active: isSelected }, item.props?.className)}
      ref={ref}
    >
      {children}
    </tr>
  )
}

interface TableCellProps<T> {
  cell: CellNode<T>
  stacked?: boolean
  state: TableState<T>
}

const TableCell = <T extends object>({ cell, stacked, state }: TableCellProps<T>) => {
  const ref = useRef<HTMLTableCellElement>(null)
  const { gridCellProps } = useTableCell({ node: cell }, state, ref)

  return (
    <td
      {...gridCellProps}
      className={cell.props?.className || undefined}
      data-cell={stacked ? cell.column?.textValue || undefined : undefined}
      ref={ref}
    >
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
