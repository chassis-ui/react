import React, { ButtonHTMLAttributes, forwardRef, useContext } from 'react'
import classNames from 'classnames'

import { SubmenuActionsContext } from './submenuGroup'

export interface CSubmenuBackProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

// First item of a stacked submenu's nested menu (see `CxSubmenu`'s `stacked` prop). Closes
// the submenu and returns focus to its trigger — visible only below the `small` breakpoint.
export const CxSubmenuBack = forwardRef<HTMLButtonElement, CSubmenuBackProps>(
  ({ children, className, onClick, type = 'button', ...rest }, ref) => {
    const actions = useContext(SubmenuActionsContext)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      actions?.close()
    }

    return (
      <button
        type={type}
        className={classNames('submenu-back', 'menu-item', className)}
        {...rest}
        onClick={handleClick}
        ref={ref}
      >
        {children}
      </button>
    )
  },
)

CxSubmenuBack.displayName = 'CxSubmenuBack'
