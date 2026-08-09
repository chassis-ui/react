import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface NotificationTextProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const NotificationText = forwardRef<HTMLDivElement, NotificationTextProps>(
  ({ children, component: Component = 'div', className, ...rest }, ref) => {
    const _className = classNames('notification-text', className)

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

NotificationText.displayName = 'NotificationText'
