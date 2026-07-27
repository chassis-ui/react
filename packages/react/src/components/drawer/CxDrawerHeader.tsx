import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import classNames from 'classnames'

import { CxDrawerContext } from './CxDrawer'
import { CxCloseButton } from '../close-button/CxCloseButton'

export interface CxDrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean
}

export const CxDrawerHeader = forwardRef<HTMLDivElement, CxDrawerHeaderProps>(
  ({ children, className, closeButton = true, ...rest }, ref) => {
    const { requestClose } = useContext(CxDrawerContext)
    const _className = classNames('drawer-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CxCloseButton onClick={() => requestClose?.()} />}
      </div>
    )
  }
)

CxDrawerHeader.displayName = 'CxDrawerHeader'
