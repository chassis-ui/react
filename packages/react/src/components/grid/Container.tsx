import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Breakpoint } from '../../types'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Set container 100% wide until the given breakpoint, after which it scales up with `max-width`
   * at every larger breakpoint.
   *
   * @type Breakpoint
   */
  fluidUntil?: Breakpoint
  /**
   * Set container 100% wide, spanning the entire width of the viewport.
   */
  fluid?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, fluidUntil, fluid, ...rest }, ref) => {
    const responsiveClassNames: string[] = []

    fluid && responsiveClassNames.push('container-fluid')
    fluidUntil && responsiveClassNames.push(`container-${fluidUntil}`)

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
