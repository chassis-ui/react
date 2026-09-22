import classNames from 'classnames'

import { Breakpoint, ContextColor } from '../types'

// The styling props `Table` and `StaticTable` share. Kept in one place so the two can't drift into
// applying different chassis-css classes for the same prop — `StaticTable` exists to be the
// zero-JS twin of `Table`'s look, so a prop meaning something different on each would defeat it.
export interface TableStyleProps {
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
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component.
   */
  color?: ContextColor
  /**
   * Enable a hover state on table rows.
   */
  hover?: boolean
  /**
   * Make any table responsive across all viewports or pick a maximum breakpoint.
   */
  responsive?: boolean | Breakpoint
  /**
   * Make table more compact by cutting all cell padding.
   */
  sm?: boolean
  /**
   * Convert rows into stacked label/value blocks below a container width, for tables with too
   * many columns to read comfortably even with horizontal scrolling. `true` always stacks; a
   * breakpoint name stacks only below it. Implies `responsive` when `responsive` isn't set
   * separately, since stacking needs the same `.table-responsive` container-query ancestor.
   */
  stacked?: boolean | Breakpoint
  /**
   * Add zebra-striping to table rows.
   */
  striped?: boolean
}

export function tableClassName({
  align,
  bordered,
  borderless,
  className,
  color,
  hover,
  sm,
  stacked,
  striped
}: TableStyleProps): string | undefined {
  return (
    classNames(
      'table',
      color,
      {
        [`align-${align}`]: align,
        bordered,
        borderless,
        hoverable: hover,
        sm,
        stacked: stacked === true,
        striped
      },
      typeof stacked === 'string' ? `max-${stacked}:stacked` : undefined,
      className
    ) || undefined
  )
}

// `undefined` when the table needs no wrapper at all. Stacking needs the same `.table-responsive`
// container-query ancestor as horizontal scrolling, so `stacked` alone still gets one.
export function tableWrapperClassName({
  responsive,
  stacked
}: Pick<TableStyleProps, 'responsive' | 'stacked'>): string | undefined {
  if (!responsive && !stacked) return undefined
  if (!responsive || responsive === true) return 'table-responsive'
  return `max-${responsive}:table-responsive`
}
