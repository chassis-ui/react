import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { BREAKPOINT_NAME, SHORT_BREAKPOINTS } from '../../utils/breakpoints'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Set container 100% wide until small breakpoint.
   */
  sm?: boolean
  /**
   * Set container 100% wide until medium breakpoint.
   */
  md?: boolean
  /**
   * Set container 100% wide until large breakpoint.
   */
  lg?: boolean
  /**
   * Set container 100% wide until X-large breakpoint.
   */
  xl?: boolean
  /**
   * Set container 100% wide until XX-large breakpoint.
   */
  xxl?: boolean
  /**
   * Set container 100% wide, spanning the entire width of the viewport.
   */
  fluid?: boolean
}

// `Container` doesn't use `xs` (there's no "100% wide until xs" variant — that's just the plain
// `.container` default), so the shared breakpoint list is sliced down to `sm`..`xxl`.
const CONTAINER_BREAKPOINTS = SHORT_BREAKPOINTS.filter((bp) => bp !== 'xs')

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, sm, md, lg, xl, xxl, fluid, ...rest }, ref) => {
    const breakpointProps = { sm, md, lg, xl, xxl }
    const responsiveClassNames: string[] = []

    fluid && responsiveClassNames.push('container-fluid')

    ;[...CONTAINER_BREAKPOINTS].reverse().forEach((bp) => {
      breakpointProps[bp] && responsiveClassNames.push(`container-${BREAKPOINT_NAME[bp]}`)
    })

    const _className = classNames(
      responsiveClassNames.length ? responsiveClassNames : 'container',
      className
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'
