import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Colors, Shapes, TextColors } from '../Types'

export interface CBadgeProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: Colors
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
   *
   * @type 'rounded' | 'rounded-top' | 'rounded-end' | 'rounded-bottom' | 'rounded-start' | 'rounded-circle' | 'rounded-pill' | 'rounded-0' | 'rounded-1' | 'rounded-2' | 'rounded-3' | string
   */
  shape?: Shapes
  /**
   * Size the component small.
   */
  size?: 'small'
  /**
   * Sets the text context of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'white' | 'white-50' | 'muted' | 'black-50' | 'body' | string
   */
  textColor?: TextColors
}
export const CxBadge = forwardRef<HTMLDivElement | HTMLSpanElement, CBadgeProps>(
  (
    {
      children,
      className,
      context,
      component: Component = 'span',
      position,
      shape,
      size,
      textColor,
      ...rest
    },
    ref,
  ) => {
    const _className = classNames(
      'badge',
      context,
      size,
      {
        'position-absolute translate-middle': position,
        'top-0': position?.includes('top'),
        'top-100': position?.includes('bottom'),
        'start-100': position?.includes('end'),
        'start-0': position?.includes('start'),
        [`fg-${textColor}`]: textColor,
      },
      shape,
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
