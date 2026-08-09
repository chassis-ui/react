import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Span, buildResponsiveClassNames } from '../../utils/breakpoints'
import { Breakpoint, ContextColor } from '../../types'

export interface PlaceholderProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Set animation type to better convey the perception of something being actively loaded.
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
   * Size the component extra small, small, or large.
   */
  size?: 'xsmall' | 'small' | 'large'
  /**
   * Width of the placeholder, expressed as a column span (of 12), or `'auto'`/`true` for a
   * natural-width placeholder.
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

export const Placeholder = forwardRef<HTMLSpanElement, PlaceholderProps>(
  (
    {
      children,
      animation,
      className,
      color,
      component: Component = 'span',
      size,
      span,
      responsive,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      animation ? `placeholder-${animation}` : 'placeholder',
      {
        [`bg-${color}`]: color,
        [`placeholder-${size}`]: size
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

Placeholder.displayName = 'Placeholder'
