import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { useDrawer } from '../../hooks'
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
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string
}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, className, closeButton = true, closeLabel, ...rest }, ref) => {
    const { close } = useDrawer()
    const _className = classNames('drawer-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CloseButton label={closeLabel} onClick={close} />}
      </div>
    )
  }
)

DrawerHeader.displayName = 'DrawerHeader'
