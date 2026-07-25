import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxCardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxCardTitle = forwardRef<HTMLHeadingElement, CxCardTitleProps>(
  ({ children, component: Component = 'h5', className, ...rest }, ref) => {
    const _className = classNames('card-title', className)

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  },
)

CxCardTitle.displayName = 'CxCardTitle'
