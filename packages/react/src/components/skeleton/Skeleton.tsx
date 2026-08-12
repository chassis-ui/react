import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Span, buildResponsiveClassNames } from '../../utils/breakpoints'
import { Breakpoint, ContextColor } from '../../types'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Renders `skeleton-{animation}` on this element instead of the bare `skeleton` class. Nest
   * plain `<Skeleton>` children inside it for the glow pulse to reach them, or apply `wave`
   * directly to a container of one or more `<Skeleton>` children for a directional sweep.
   */
  animation?: 'glow' | 'wave'
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Width of the skeleton, expressed as a column span (of 12), or `'auto'`/`true` for a
   * natural-width skeleton.
   *
   * @type { 'auto' | number | string | boolean }
   */
  span?: Span
  /**
   * Overrides `span` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', 'auto' | number | string | boolean>> }
   */
  responsive?: Partial<Record<Breakpoint, Span>>
}

const spanClassNames = (span: Span | undefined, prefix: string) => [
  typeof span === 'number' || typeof span === 'string' ? `${prefix}col-${span}` : null,
  span === true ? `${prefix}col` : null
]

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  (
    {
      children,
      animation,
      className,
      color,
      component: Component = 'span',
      span,
      responsive,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      animation ? `skeleton-${animation}` : 'skeleton',
      {
        [`bg-${color}`]: color
      },
      buildResponsiveClassNames(spanClassNames, span, responsive),
      className
    )

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

Skeleton.displayName = 'Skeleton'
