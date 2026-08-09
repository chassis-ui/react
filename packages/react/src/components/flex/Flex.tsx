import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Spacing } from '../../types'

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Renders an inline flex container (`.d-inline-flex`) instead of a block-level one (`.d-flex`,
   * the default).
   */
  inline?: boolean
  /**
   * Sets `flex-direction`. Omit for the browser default (`row`).
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  /**
   * Sets `flex-wrap`. Omit for the browser default (`nowrap`).
   */
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  /**
   * Sets `justify-content`, aligning items along the main axis.
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  /**
   * Sets `align-items`, aligning items along the cross axis.
   */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /**
   * Sets `align-content`, distributing wrapped lines along the cross axis. Has no effect on
   * single-line (non-wrapping) containers.
   */
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
  /**
   * Spacing between children, mapped to the `gap-*` utility classes.
   */
  gap?: Spacing | 0
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      className,
      component: Component = 'div',
      inline,
      direction,
      wrap,
      justify,
      align,
      alignContent,
      gap,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      inline ? 'd-inline-flex' : 'd-flex',
      direction && `flex-${direction}`,
      wrap && `flex-${wrap}`,
      justify && `justify-content-${justify}`,
      align && `align-items-${align}`,
      alignContent && `align-content-${alignContent}`,
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

Flex.displayName = 'Flex'
