import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { buildResponsiveClassNames } from '../../utils/breakpoints'
import { devWarning } from '../../utils/devWarning'
import { spacingClassName } from '../../utils/spacingClassName'
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

/**
 * @deprecated Use `GridProps`: `Row` is deprecated with the flexbox grid of `@chassis-ui/css`.
 */
export interface RowProps extends HTMLAttributes<HTMLDivElement>, RowLayout {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Overrides `cols`/`gutter`/`gutterX`/`gutterY` at a breakpoint and up.
   *
   * @type { Partial<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', { cols?: 'auto' | number | string, gutter?: Spacing | 0, gutterX?: Spacing | 0, gutterY?: Spacing | 0 }>> }
   */
  responsive?: Partial<Record<Breakpoint, RowLayout>>
}

const layoutClassNames = ({ cols, gutter, gutterX, gutterY }: RowLayout, prefix: string) => [
  cols ? `${prefix}row-cols-${cols}` : null,
  spacingClassName('g', gutter, prefix),
  spacingClassName('gx', gutterX, prefix),
  spacingClassName('gy', gutterY, prefix)
]

/**
 * @deprecated Use `Grid`, with `columns` for `cols` and `gap` for `gutter`. `@chassis-ui/css`
 * deprecates its flexbox grid (`.row`, `.col-*`) in 0.6 and removes it in 0.7, and `Row` goes
 * with it.
 */
export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ children, className, cols, gutter, gutterX, gutterY, responsive, ...rest }, ref) => {
    devWarning(
      true,
      'Row: Row and Col are deprecated with the flexbox grid of @chassis-ui/css, use Grid and ' +
        'GridItem instead. They will be removed in a future major version.'
    )

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
