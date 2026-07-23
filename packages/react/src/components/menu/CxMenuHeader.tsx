import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CMenuHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxMenuHeader = forwardRef<HTMLHeadingElement, CMenuHeaderProps>(
  ({ children, className, component: Component = 'h4', ...rest }, ref) => {
    const _className = classNames('menu-header', className)

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  },
)

CxMenuHeader.displayName = 'CxMenuHeader'
