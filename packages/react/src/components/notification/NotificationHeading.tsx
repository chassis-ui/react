import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface NotificationHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const NotificationHeading = forwardRef<HTMLHeadingElement, NotificationHeadingProps>(
  ({ children, className, component: Component = 'h4', ...rest }, ref) => {
    const _className = classNames('notification-heading', className)

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

NotificationHeading.displayName = 'NotificationHeading'
