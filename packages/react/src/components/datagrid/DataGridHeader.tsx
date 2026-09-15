import React, { ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import { TableHeader as AriaTableHeader } from 'react-aria-components'

export interface DataGridHeaderProps<T> {
  /**
   * `DataGridColumn` elements, or a render function paired with `columns` for dynamic column
   * generation.
   */
  children: ReactNode | ((column: T) => ReactElement)
  /**
   * A string of all className you want applied to the header row group.
   */
  className?: string
  /**
   * A list of column data objects, rendered via the function form of `children`.
   */
  columns?: Iterable<T>
  /**
   * Values that should invalidate the column cache when using the `columns`/render-function form
   * of `children` — see `DataGridBody`'s `dependencies` for why this matters.
   */
  dependencies?: ReadonlyArray<unknown>
}

/**
 * Header row group for `DataGrid`, containing `DataGridColumn`s. Unlike `Table`'s sub-parts,
 * this renders directly — it's a thin wrapper over react-aria-components' own `TableHeader`.
 *
 * Always carries the `datagrid-header` class (not just the caller's `className`) — `DataGrid.scss`
 * uses it to tell header cells from body cells, since react-aria-components renders both as plain
 * `[role="rowgroup"]` divs with no structural difference to select on otherwise.
 */
export const DataGridHeader = <T extends object>({
  children,
  className,
  columns,
  dependencies
}: DataGridHeaderProps<T>) => (
  <AriaTableHeader
    className={classNames('datagrid-header', className)}
    columns={columns}
    dependencies={dependencies}
  >
    {children}
  </AriaTableHeader>
)
