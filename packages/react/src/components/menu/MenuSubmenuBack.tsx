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
// the submenu and returns focus to its trigger — visible only below the `sm` breakpoint.
export const MenuSubmenuBack = forwardRef<HTMLButtonElement, MenuSubmenuBackProps>(
  ({ children, className, onClick, type = 'button', ...rest }, ref) => {
    const actions = useContext(SubmenuActionsContext)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!actions) return
      // Going back is the submenu's own action, as opening it from its trigger is: the click
      // stops here. On `window`, the `autoClose` listener of `Menu` and `ContextMenu` would read
      // it as a click on an item and close the whole menu.
      event.stopPropagation()
      actions.close()
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
