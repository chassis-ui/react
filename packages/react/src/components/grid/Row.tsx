import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { BREAKPOINT_NAME, SHORT_BREAKPOINTS } from '../../utils/breakpoints'
import { Spacing } from '../../types'

export type BPObject = {
  cols?: 'auto' | number | string | null
  gutter?: Spacing | 0 | null
  gutterX?: Spacing | 0 | null
  gutterY?: Spacing | 0 | null
}

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The number of columns/offset/order on extra small devices (<576px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: Spacing | 0 } | { gutterX: Spacing | 0 } | { gutterY: Spacing | 0 }}
   */
  xs?: BPObject
  /**
   * The number of columns/offset/order on small devices (<768px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: Spacing | 0 } | { gutterX: Spacing | 0 } | { gutterY: Spacing | 0 }}
   */
  sm?: BPObject
  /**
   * The number of columns/offset/order on medium devices (<992px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: Spacing | 0 } | { gutterX: Spacing | 0 } | { gutterY: Spacing | 0 }}
   */
  md?: BPObject
  /**
   * The number of columns/offset/order on large devices (<1200px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: Spacing | 0 } | { gutterX: Spacing | 0 } | { gutterY: Spacing | 0 }}
   */
  lg?: BPObject
  /**
   * The number of columns/offset/order on X-Large devices (<1400px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: Spacing | 0 } | { gutterX: Spacing | 0 } | { gutterY: Spacing | 0 }}
   */
  xl?: BPObject
  /**
   * The number of columns/offset/order on XX-Large devices (≥1400px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: Spacing | 0 } | { gutterX: Spacing | 0 } | { gutterY: Spacing | 0 }}
   */
  xxl?: BPObject
}

export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ children, className, xs, sm, md, lg, xl, xxl, ...rest }, ref) => {
    const breakpointProps = { xs, sm, md, lg, xl, xxl }
    const responsiveClassNames: string[] = []

    ;[...SHORT_BREAKPOINTS].reverse().forEach((bp) => {
      const breakpoint = breakpointProps[bp]

      const bpName = BREAKPOINT_NAME[bp]
      const prefix = bpName ? `${bpName}:` : ''

      if (typeof breakpoint === 'object') {
        if (breakpoint.cols) {
          responsiveClassNames.push(`${prefix}row-cols-${breakpoint.cols}`)
        }
        if (typeof breakpoint.gutter === 'string' || typeof breakpoint.gutter === 'number') {
          responsiveClassNames.push(`${prefix}g-${breakpoint.gutter}`)
        }
        if (typeof breakpoint.gutterX === 'string' || typeof breakpoint.gutterX === 'number') {
          responsiveClassNames.push(`${prefix}gx-${breakpoint.gutterX}`)
        }
        if (typeof breakpoint.gutterY === 'string' || typeof breakpoint.gutterY === 'number') {
          responsiveClassNames.push(`${prefix}gy-${breakpoint.gutterY}`)
        }
      }
    })

    const _className = classNames('row', responsiveClassNames, className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

Row.displayName = 'Row'
