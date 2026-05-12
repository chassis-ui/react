import React, { ElementType, forwardRef, useContext } from 'react'
import { CToastContext } from './CxToast'
import { CxCloseButton, CCloseButtonProps } from '../close-button/CxCloseButton'

export interface CToastCloseProps extends CCloseButtonProps {
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxToastClose = forwardRef<HTMLButtonElement, CToastCloseProps>(
  ({ children, component: Component, ...rest }, ref) => {
    const { setVisible } = useContext(CToastContext)
    return Component ? (
      <Component onClick={() => setVisible(false)} {...rest} ref={ref}>
        {children}
      </Component>
    ) : (
      <CxCloseButton onClick={() => setVisible(false)} {...rest} ref={ref} />
    )
  },
)

CxToastClose.displayName = 'CxToastClose'
