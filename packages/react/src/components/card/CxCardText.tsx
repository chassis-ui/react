import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxCardTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxCardText = forwardRef<HTMLParagraphElement, CxCardTextProps>(
  ({ children, component: Component = 'p', className, ...rest }, ref) => {
    const _className = classNames('card-text', className)

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  },
)

CxCardText.displayName = 'CxCardText'
