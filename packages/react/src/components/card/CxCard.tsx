import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CxCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the context color of the component to one of Chassis themed colors.
   */
  context?: ContextColor
  /**
   * Sets the text context color of the component to one of Chassis themed colors.
   *
   * @type ContextColor | 'main' | 'subtle' | 'slight' | 'inverse' | 'solid' | 'highlight' | 'idle' | 'disabled' | 'hover' | 'press' | string
   */
  textColor?: string
}

export const CxCard = forwardRef<HTMLDivElement, CxCardProps>(
  ({ children, className, context, textColor, ...rest }, ref) => {
    const _className = classNames(
      'card',
      {
        [`bg-${context}`]: context,
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

CxCard.displayName = 'CxCard'
