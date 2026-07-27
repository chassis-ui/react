import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxFormTextProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxFormText = forwardRef<HTMLDivElement | HTMLSpanElement, CxFormTextProps>(
  ({ children, className, component: Component = 'div', ...rest }, ref) => {
    const _className = classNames('form-help', className)
    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

CxFormText.displayName = 'CxFormText'
