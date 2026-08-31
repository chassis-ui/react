import React, { ButtonHTMLAttributes, forwardRef, useContext } from 'react'
import classNames from 'classnames'

import { SubmenuActionsContext } from './submenuGroup'

export interface MenuSubmenuBackProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

// First item of a stacked submenu's nested menu (see `MenuSubmenu`'s `stacked` prop). Closes
// the submenu and returns focus to its trigger — visible only below the `small` breakpoint.
export const MenuSubmenuBack = forwardRef<HTMLButtonElement, MenuSubmenuBackProps>(
  ({ children, className, onClick, type = 'button', ...rest }, ref) => {
    const actions = useContext(SubmenuActionsContext)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      actions?.close()
    }

    return (
      <button
        type={type}
        role="menuitem"
        className={classNames('submenu-back', 'menu-item', className)}
        {...rest}
        onClick={handleClick}
        ref={ref}
      >
        {children}
      </button>
    )
  }
)

MenuSubmenuBack.displayName = 'MenuSubmenuBack'
