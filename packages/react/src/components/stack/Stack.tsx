import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { BREAKPOINTS } from '../../utils/breakpoints'
import { Breakpoint, Spacing } from '../../types'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Lays children out in a row (`horizontal`, the default, maps to `.hstack`) or a column
   * (`vertical`, maps to `.vstack`).
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * Spacing between children, mapped to the `gap-*` utility classes.
   */
  gap?: Spacing | 0
  /**
   * Switches `direction` at one or more breakpoints via container queries. Requires a
   * `.contains-inline` ancestor (not applied by `Stack` itself — see the docs) to establish the
   * container context these queries evaluate against.
   */
  responsive?: Partial<Record<Breakpoint, 'horizontal' | 'vertical'>>
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      className,
      component: Component = 'div',
      direction = 'horizontal',
      gap,
      responsive,
      ...rest
    },
    ref
  ) => {
    const responsiveClassNames = responsive
      ? BREAKPOINTS.filter((bp) => responsive[bp]).map(
          (bp) => `${bp}:${responsive[bp] === 'vertical' ? 'vstack' : 'hstack'}`
        )
      : []

    const _className = classNames(
      direction === 'vertical' ? 'vstack' : 'hstack',
      responsiveClassNames,
      typeof gap === 'string' || typeof gap === 'number' ? `gap-${gap}` : null,
      className
    )

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

Stack.displayName = 'Stack'
