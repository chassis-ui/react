import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface InputAddonProps extends HTMLAttributes<HTMLLabelElement | HTMLSpanElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const InputAddon = forwardRef<HTMLLabelElement | HTMLSpanElement, InputAddonProps>(
  ({ children, className, component: Component = 'span', ...rest }, ref) => {
    const _className = classNames('input-addon', className)
    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

InputAddon.displayName = 'InputAddon'
