import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { BREAKPOINT_NAME, SHORT_BREAKPOINTS } from '../../utils/breakpoints'

type Span = 'auto' | number | string | boolean | null

type BPObject = {
  span?: Span
  offset?: number | string | null
  order?: 'first' | 'last' | number | string | null
}

type Col = Span | BPObject

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The number of columns/offset/order on extra small devices (<576px).
   *
   * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
   */
  xs?: Col
  /**
   * The number of columns/offset/order on small devices (<768px).
   *
   * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
   */
  sm?: Col
  /**
   * The number of columns/offset/order on medium devices (<992px).
   *
   * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
   */
  md?: Col
  /**
   * The number of columns/offset/order on large devices (<1200px).
   *
   * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
   */
  lg?: Col
  /**
   * The number of columns/offset/order on X-Large devices (<1400px).
   *
   * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
   */
  xl?: Col
  /**
   * The number of columns/offset/order on XX-Large devices (≥1400px).
   *
   * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
   */
  xxl?: Col
}

export const Col = forwardRef<HTMLDivElement, ColProps>(
  ({ children, className, xs, sm, md, lg, xl, xxl, ...rest }, ref) => {
    const breakpointProps = { xs, sm, md, lg, xl, xxl }
    const responsiveClassNames: string[] = []

    ;[...SHORT_BREAKPOINTS].reverse().forEach((bp) => {
      const breakpoint = breakpointProps[bp]

      const bpName = BREAKPOINT_NAME[bp]
      const prefix = bpName ? `${bpName}:` : ''
      const suffix = bpName ? `-${bpName}` : ''

      if (typeof breakpoint === 'number' || typeof breakpoint === 'string') {
        responsiveClassNames.push(`${prefix}col-${breakpoint}`)
      }

      if (typeof breakpoint === 'boolean') {
        responsiveClassNames.push(`col${suffix}`)
      }

      if (breakpoint && typeof breakpoint === 'object') {
        if (typeof breakpoint.span === 'number' || typeof breakpoint.span === 'string') {
          responsiveClassNames.push(`${prefix}col-${breakpoint.span}`)
        }

        if (typeof breakpoint.span === 'boolean') {
          responsiveClassNames.push(`col${suffix}`)
        }

        if (typeof breakpoint.order === 'number' || typeof breakpoint.order === 'string') {
          responsiveClassNames.push(`${prefix}order-${breakpoint.order}`)
        }

        if (typeof breakpoint.offset === 'number') {
          responsiveClassNames.push(`${prefix}offset-${breakpoint.offset}`)
        }
      }
    })

    const _className = classNames(
      responsiveClassNames.length ? responsiveClassNames : 'col',
      className
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

Col.displayName = 'Col'
