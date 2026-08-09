import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { buildResponsiveClassNames } from '../../utils/breakpoints'
import { Breakpoint, Spacing } from '../../types'

export interface RowLayout {
  /**
   * Equal-width columns per row, or `'auto'` for content-sized columns.
   *
   * @type { 'auto' | number | string }
   */
  cols?: 'auto' | number | string
  /**
   * Gutter width on both axes.
   *
   * @type { Spacing | 0 }
   */
  gutter?: Spacing | 0
  /**
   * Horizontal gutter width.
   *
   * @type { Spacing | 0 }
   */
  gutterX?: Spacing | 0
  /**
   * Vertical gutter width.
   *
   * @type { Spacing | 0 }
   */
  gutterY?: Spacing | 0
}

export interface RowProps extends HTMLAttributes<HTMLDivElement>, RowLayout {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Overrides `cols`/`gutter`/`gutterX`/`gutterY` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', { cols?: 'auto' | number | string, gutter?: Spacing | 0, gutterX?: Spacing | 0, gutterY?: Spacing | 0 }>> }
   */
  responsive?: Partial<Record<Breakpoint, RowLayout>>
}

const layoutClassNames = ({ cols, gutter, gutterX, gutterY }: RowLayout, prefix: string) => [
  cols ? `${prefix}row-cols-${cols}` : null,
  typeof gutter === 'string' || typeof gutter === 'number' ? `${prefix}g-${gutter}` : null,
  typeof gutterX === 'string' || typeof gutterX === 'number' ? `${prefix}gx-${gutterX}` : null,
  typeof gutterY === 'string' || typeof gutterY === 'number' ? `${prefix}gy-${gutterY}` : null
]

export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ children, className, cols, gutter, gutterX, gutterY, responsive, ...rest }, ref) => {
    const _className = classNames(
      'row',
      buildResponsiveClassNames(layoutClassNames, { cols, gutter, gutterX, gutterY }, responsive),
      className
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

Row.displayName = 'Row'
