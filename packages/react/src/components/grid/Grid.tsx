import React, { CSSProperties, ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Spacing, SPACING } from '../../types'

type GridStyle = CSSProperties & {
  '--cx-grid-columns'?: number
  '--cx-grid-rows'?: number
  '--cx-grid-gap'?: string
  '--cx-gap'?: string
}

const SPACING_TOKENS = new Set<string>(SPACING)

// `Spacing` tokens map to the matching `--cx-space-*` custom property; anything else (a raw CSS
// value, e.g. `"1rem"` or `".25rem 1rem"`) passes through unchanged.
const resolveGap = (gap: string) => (SPACING_TOKENS.has(gap) ? `var(--cx-space-${gap})` : gap)

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Number of columns in the grid template, set via the `--cx-grid-columns` custom property
   * (defaults to `12` in CSS when omitted). Has no effect when `fill` is set.
   */
  columns?: number
  /**
   * Number of rows in the grid template, set via the `--cx-grid-rows` custom property (defaults
   * to `1` in CSS when omitted). Has no effect when `fill` is set.
   */
  rows?: number
  /**
   * Gap between grid items, set via the `--cx-grid-gap` custom property (or `--cx-gap` when
   * `fill` is set). Accepts a `Spacing` token (mapped to the matching `--cx-space-*` custom
   * property) or any raw CSS `gap` value, including a `"{row} {column}"` pair.
   *
   * @type { Spacing | string }
   */
  gap?: Spacing | (string & {})
  /**
   * Renders `.grid-fill` instead of `.grid` — columns expand equally to fill the available
   * width, with the column count determined by the number of children rather than `columns`.
   */
  fill?: boolean
  /**
   * Adds `.grid-cols-subgrid` alongside the base class, causing this grid to inherit its parent
   * grid's column tracks instead of defining its own.
   */
  subgrid?: boolean
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      className,
      component: Component = 'div',
      columns,
      rows,
      gap,
      fill,
      subgrid,
      style,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      fill ? 'grid-fill' : 'grid',
      subgrid && 'grid-cols-subgrid',
      className
    )

    const _style: GridStyle = { ...style }

    if (fill) {
      if (gap !== undefined) _style['--cx-gap'] = resolveGap(gap)
    } else {
      if (columns !== undefined) _style['--cx-grid-columns'] = columns
      if (rows !== undefined) _style['--cx-grid-rows'] = rows
      if (gap !== undefined) _style['--cx-grid-gap'] = resolveGap(gap)
    }

    return (
      <Component className={_className} style={_style} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

Grid.displayName = 'Grid'
