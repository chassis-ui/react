import React, { forwardRef, ReactNode, TableHTMLAttributes } from 'react'

import { TableStyleProps, tableClassName, tableWrapperClassName } from '../../utils/tableClassName'

export interface StaticTableProps
  extends TableStyleProps, Omit<TableHTMLAttributes<HTMLTableElement>, 'align' | 'color'> {
  /**
   * Content shown above the table, functioning as a heading for it.
   */
  caption?: ReactNode
  /**
   * The table's own markup — plain `<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>` elements,
   * rendered as-is.
   */
  children?: ReactNode
  /**
   * Convert rows into stacked label/value blocks below a container width, for tables with too
   * many columns to read comfortably even with horizontal scrolling. `true` always stacks; a
   * breakpoint name stacks only below it. Implies `responsive` when `responsive` isn't set
   * separately. Unlike `Table`, which derives each cell's label from its column header, a static
   * table has no collection to read labels from — give each `<td>` a `data-cell` attribute with
   * the label to show before its value.
   */
  stacked?: TableStyleProps['stacked']
}

// A plain, server-renderable `<table>` with `Table`'s styling props and none of its behavior — no
// sorting, selection, or keyboard grid navigation, and no hooks, so it needs no client JavaScript
// at all. Imported from `@chassis-ui/react/static-table`, whose entry deliberately has no
// `'use client'` directive (see `RSC.md`). `forwardRef` is fine here: React Server Components
// render forwardRef components like any other function component (a ref just can't be passed
// from the server side).
export const StaticTable = forwardRef<HTMLTableElement, StaticTableProps>(
  (
    {
      align,
      bordered,
      borderless,
      caption,
      children,
      className,
      color,
      hover,
      responsive,
      sm,
      stacked,
      striped,
      ...rest
    },
    ref
  ) => {
    const table = (
      <table
        {...rest}
        className={tableClassName({
          align,
          bordered,
          borderless,
          className,
          color,
          hover,
          sm,
          stacked,
          striped
        })}
        ref={ref}
      >
        {caption && <caption>{caption}</caption>}
        {children}
      </table>
    )

    const wrapperClassName = tableWrapperClassName({ responsive, stacked })
    return wrapperClassName ? <div className={wrapperClassName}>{table}</div> : table
  }
)

StaticTable.displayName = 'StaticTable'
