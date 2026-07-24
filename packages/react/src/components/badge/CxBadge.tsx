import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor, ContextStyle, Sizing } from '../Types'

export interface CBadgeProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   */
  context?: ContextColor
  /**
   * Sets the context style of the component. `solid`/`basic` render the default look with no extra class.
   */
  variant?: ContextStyle
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Position badge in one of the corners of a link or button.
   */
  position?: 'top-start' | 'top-end' | 'bottom-end' | 'bottom-start'
  /**
   * Select the shape of the component.
   */
  circle?: boolean
  /**
   * Sets the size of the component to one of Chassis component sizes.
   */
  size?: Sizing
}
export const CxBadge = forwardRef<HTMLDivElement | HTMLSpanElement, CBadgeProps>(
  (
    {
      children,
      className,
      context,
      variant,
      component: Component = 'span',
      position,
      circle,
      size,
      ...rest
    },
    ref,
  ) => {
    const _className = classNames(
      'badge',
      context,
      size,
      {
        outline: variant === 'outline',
        smooth: variant === 'smooth',
        'position-absolute translate-middle': position,
        'top-0': position?.includes('top'),
        'top-100': position?.includes('bottom'),
        'start-100': position?.includes('end'),
        'start-0': position?.includes('start'),
      },
      { circle },
      className,
    )

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  },
)

CxBadge.displayName = 'CxBadge'
