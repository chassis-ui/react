import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Span, buildResponsiveClassNames } from '../../utils/breakpoints'
import { Breakpoint } from '../../types'

export interface ColLayout {
  /**
   * Columns (of 12) this Col spans, or `'auto'`/`true` for a natural-width column.
   *
   * @type { 'auto' | number | string | boolean }
   */
  span?: Span
  /**
   * Columns to offset the start of this Col by.
   */
  offset?: number | string
  /**
   * Visual order relative to sibling columns.
   *
   * @type { 'first' | 'last' | number | string }
   */
  order?: 'first' | 'last' | number | string
}

export interface ColProps extends HTMLAttributes<HTMLDivElement>, ColLayout {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Overrides `span`/`offset`/`order` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', { span?: 'auto' | number | string | boolean, offset?: number | string, order?: 'first' | 'last' | number | string }>> }
   */
  responsive?: Partial<Record<Breakpoint, ColLayout>>
}

const layoutClassNames = ({ span, offset, order }: ColLayout, prefix: string) => [
  typeof span === 'number' || typeof span === 'string' ? `${prefix}col-${span}` : null,
  span === true ? `${prefix}col` : null,
  typeof offset === 'number' || typeof offset === 'string' ? `${prefix}offset-${offset}` : null,
  typeof order === 'number' || typeof order === 'string' ? `${prefix}order-${order}` : null
]

export const Col = forwardRef<HTMLDivElement, ColProps>(
  ({ children, className, span, offset, order, responsive, ...rest }, ref) => {
    const layoutClassList = buildResponsiveClassNames(
      layoutClassNames,
      { span, offset, order },
      responsive
    )

    // The base breakpoint only gets its equal-width flex sizing from an explicit `span` (base or
    // `col`'s own class) or from the fallback bare `col` below — `offset`/`order` alone (or a
    // `span` set only inside `responsive`) don't provide it, so without this the column would
    // render at `flex: 0 1 auto` instead of a proper flexible column below the first tier that
    // sets a span.
    const _className = classNames(span === undefined && 'col', layoutClassList, className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

Col.displayName = 'Col'
