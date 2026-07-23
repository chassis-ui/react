import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CMenuTextProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxMenuText = forwardRef<HTMLSpanElement, CMenuTextProps>(
  ({ children, className, component: Component = 'span', ...rest }, ref) => {
    const _className = classNames('menu-text', className)

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  },
)

CxMenuText.displayName = 'CxMenuText'
