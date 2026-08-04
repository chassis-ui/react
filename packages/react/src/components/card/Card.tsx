import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Sets the text context color of the component to one of Chassis context colors.
   *
   * @type ContextColor | 'main' | 'subtle' | 'slight' | 'inverse' | 'solid' | 'highlight' | 'idle' | 'disabled' | 'hover' | 'press' | string
   */
  textColor?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, color, textColor, ...rest }, ref) => {
    const _className = classNames(
      'card',
      {
        [`bg-${color}`]: color,
        [`fg-${textColor}`]: textColor
      },
      className
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
