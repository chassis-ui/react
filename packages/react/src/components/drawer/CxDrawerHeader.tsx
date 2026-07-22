import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import classNames from 'classnames'

import { CDrawerContext } from './CxDrawer'
import { CxCloseButton } from '../close-button/CxCloseButton'

export interface CDrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean
}

export const CxDrawerHeader = forwardRef<HTMLDivElement, CDrawerHeaderProps>(
  ({ children, className, closeButton = true, ...rest }, ref) => {
    const { requestClose } = useContext(CDrawerContext)
    const _className = classNames('drawer-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CxCloseButton onClick={() => requestClose?.()} />}
      </div>
    )
  },
)

CxDrawerHeader.displayName = 'CxDrawerHeader'
