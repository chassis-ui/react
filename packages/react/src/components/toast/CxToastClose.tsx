import React, { ElementType, forwardRef, useContext } from 'react'
import { CxToastContext } from './CxToast'
import { CxCloseButton, CxCloseButtonProps } from '../close-button/CxCloseButton'

export interface CxToastCloseProps extends CxCloseButtonProps {
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxToastClose = forwardRef<HTMLButtonElement, CxToastCloseProps>(
  ({ children, component: Component, onClick, ...rest }, ref) => {
    const { setVisible } = useContext(CxToastContext)
    const handleClick: typeof onClick = (event) => {
      onClick?.(event)
      setVisible(false)
    }
    return Component ? (
      <Component onClick={handleClick} {...rest} ref={ref}>
        {children}
      </Component>
    ) : (
      <CxCloseButton onClick={handleClick} {...rest} ref={ref} />
    )
  },
)

CxToastClose.displayName = 'CxToastClose'
