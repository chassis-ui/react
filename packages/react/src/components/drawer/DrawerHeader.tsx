import React, { forwardRef, HTMLAttributes, useContext } from 'react'
import classNames from 'classnames'

import { DrawerContext } from './Drawer'
import { CloseButton } from '../close-button/CloseButton'

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean
}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, className, closeButton = true, ...rest }, ref) => {
    const { requestClose } = useContext(DrawerContext)
    const _className = classNames('drawer-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CloseButton onClick={() => requestClose?.()} />}
      </div>
    )
  }
)

DrawerHeader.displayName = 'DrawerHeader'
