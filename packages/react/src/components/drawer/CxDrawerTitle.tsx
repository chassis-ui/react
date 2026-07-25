import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxDrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxDrawerTitle = forwardRef<HTMLHeadElement, CxDrawerTitleProps>(
  ({ children, component: Component = 'h2', className, ...rest }, ref) => {
    const _className = classNames('drawer-title', className)

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  },
)

CxDrawerTitle.displayName = 'CxDrawerTitle'
