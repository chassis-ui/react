import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: ContextColor
  /**
   * Sets the text context context of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'white' | 'white-50' | 'muted' | 'black-50' | 'body' | string
   */
  textColor?: string
}

export const CxCard = forwardRef<HTMLDivElement, CCardProps>(
  ({ children, className, context, textColor, ...rest }, ref) => {
    const _className = classNames(
      'card',
      {
        [`bg-${context}`]: context,
        [`fg-${textColor}`]: textColor,
      },
      className,
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxCard.displayName = 'CxCard'
