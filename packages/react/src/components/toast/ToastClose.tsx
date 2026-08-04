import React, { ElementType, forwardRef, useContext } from 'react'
import { ToastContext } from './Toast'
import { CloseButton, CloseButtonProps } from '../close-button/CloseButton'

export interface ToastCloseProps extends CloseButtonProps {
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ children, component: Component, onClick, ...rest }, ref) => {
    const { setVisible } = useContext(ToastContext)
    const handleClick: typeof onClick = (event) => {
      onClick?.(event)
      setVisible(false)
    }
    return Component ? (
      <Component onClick={handleClick} {...rest} ref={ref}>
        {children}
      </Component>
    ) : (
      <CloseButton onClick={handleClick} {...rest} ref={ref} />
    )
  }
)

ToastClose.displayName = 'ToastClose'
