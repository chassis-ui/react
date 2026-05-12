import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export type BPObject = {
  cols?: 'auto' | number | string | null
  gutter?: number | string | null
  gutterX?: number | string | null
  gutterY?: number | string | null
}

export interface CRowProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The number of columns/offset/order on extra small devices (<576px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
   */
  xs?: BPObject
  /**
   * The number of columns/offset/order on small devices (<768px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
   */
  sm?: BPObject
  /**
   * The number of columns/offset/order on medium devices (<992px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
   */
  md?: BPObject
  /**
   * The number of columns/offset/order on large devices (<1200px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
   */
  lg?: BPObject
  /**
   * The number of columns/offset/order on X-Large devices (<1400px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
   */
  xl?: BPObject
  /**
   * The number of columns/offset/order on XX-Large devices (≥1400px).
   *
   * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
   */
  xxl?: BPObject
}

const BREAKPOINTS = [
  'xxl' as const,
  'xl' as const,
  'lg' as const,
  'md' as const,
  'sm' as const,
  'xs' as const,
]

const BP_NAME: Record<string, string> = {
  xxl: '2xlarge',
  xl: 'xlarge',
  lg: 'large',
  md: 'medium',
  sm: 'small',
  xs: '',
}

export const CxRow = forwardRef<HTMLDivElement, CRowProps>(
  ({ children, className, ...rest }, ref) => {
    const repsonsiveClassNames: string[] = []

    BREAKPOINTS.forEach((bp) => {
      const breakpoint = rest[bp]
      delete rest[bp]

      const bpName = BP_NAME[bp]
      const prefix = bpName ? `${bpName}:` : ''

      if (typeof breakpoint === 'object') {
        if (breakpoint.cols) {
          repsonsiveClassNames.push(`${prefix}row-cols-${breakpoint.cols}`)
        }
        if (typeof breakpoint.gutter === 'number') {
          repsonsiveClassNames.push(`${prefix}g-${breakpoint.gutter}`)
        }
        if (typeof breakpoint.gutterX === 'number') {
          repsonsiveClassNames.push(`${prefix}gx-${breakpoint.gutterX}`)
        }
        if (typeof breakpoint.gutterY === 'number') {
          repsonsiveClassNames.push(`${prefix}gy-${breakpoint.gutterY}`)
        }
      }
    })

    const _className = classNames('row', repsonsiveClassNames, className)

    return (
      <div className={_className} ref={ref}>
        {children}
      </div>
    )
  },
)

CxRow.displayName = 'CxRow'
