import React, { ReactNode } from 'react'
import classNames from 'classnames'
import { Key, Column as AriaColumn } from 'react-aria-components'
import { ColumnSize, ColumnStaticSize } from 'react-stately'

export interface DataGridColumnProps {
  /**
   * Whether the column allows sorting. Adds a sort indicator and makes the header
   * clickable/keyboard-activatable.
   */
  allowsSorting?: boolean
  /**
   * Rendered contents of the column header.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the column header.
   */
  className?: string
  /**
   * The initial width of the column, e.g. for a narrow selection/icon column — a plain number or
   * `'<n>%'` for a fixed size, or `'<n>fr'` to share remaining space with other fractional
   * columns in proportion (columns default to `'1fr'`, so they split space evenly unless given
   * one of these). Unlike `Table`, which sizes a narrow column via `width: 1%` relying on native
   * `<table>` auto-layout, `DataGrid`'s virtualized layout computes every column's width itself —
   * a CSS `width` rule on the cell has no effect, so this prop is the only way to size a column.
   */
  defaultWidth?: ColumnSize | null
  /**
   * The unique id of the column, referenced by `sortDescriptor.column`.
   */
  id?: Key
  /**
   * Whether this column is a row header, announced by assistive technology during row
   * navigation.
   */
  isRowHeader?: boolean
  /**
   * The maximum width of the column, as a fixed pixel number or `'<n>%'`.
   */
  maxWidth?: ColumnStaticSize | null
  /**
   * The minimum width of the column, as a fixed pixel number or `'<n>%'`.
   */
  minWidth?: ColumnStaticSize | null
  /**
   * Pin the column so it stays visible while the grid scrolls horizontally: `'start'` pins it to
   * the leading edge, `'end'` to the trailing edge. Stacks correctly with other pinned columns on
   * the same side, in declaration order.
   */
  pin?: 'start' | 'end'
  /**
   * A string representation of the column header, used for accessibility announcements. Defaults
   * to `children` when it's a plain string — set this explicitly when the header contains
   * anything else (an icon, a `Tooltip`, etc.).
   */
  textValue?: string
}

/**
 * A column within `DataGrid`. Unlike `Table`'s sub-parts, this renders directly — it's a thin
 * wrapper over react-aria-components' own `Column`.
 *
 * When `allowsSorting` is set, renders a sort indicator after `children` — mirrors `Table`'s own
 * `TableColumnHeader`, but reads the active direction from react-aria-components' own
 * `ColumnRenderProps` (via the `children` render-prop form) instead of reaching into table state
 * directly, since this wrapper has no state of its own to read.
 */
export const DataGridColumn = ({
  allowsSorting,
  children,
  className,
  defaultWidth,
  id,
  isRowHeader,
  maxWidth,
  minWidth,
  pin,
  textValue
}: DataGridColumnProps) => (
  <AriaColumn
    allowsSorting={allowsSorting}
    className={classNames('datagrid-col', pin && `datagrid-col-pinned-${pin}`, className)}
    defaultWidth={defaultWidth}
    id={id}
    isRowHeader={isRowHeader}
    maxWidth={maxWidth}
    minWidth={minWidth}
    textValue={textValue}
    // `pin` isn't a react-aria-components `Column` prop, but its collection builder preserves
    // the full props object it's given verbatim (see react-stately's `Column.getCollectionNode`)
    // — passing it through here is what makes it reach `column.props.pin` in
    // `DataGridTableLayout`'s `isStickyColumn` override, which is what positions `pin="start"`.
    // `pin="end"` is handled separately by `DataGridPinBehavior`, which reads the same prop off
    // the header's JSX rather than the resolved collection.
    {...({ pin } as Record<string, unknown>)}
  >
    {allowsSorting
      ? ({ sortDirection }) => (
          <>
            {children}
            <span aria-hidden="true" className="datagrid-sort-icon">
              {sortDirection === 'ascending' ? '▲' : sortDirection === 'descending' ? '▼' : '⇅'}
            </span>
          </>
        )
      : children}
  </AriaColumn>
)
