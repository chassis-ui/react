import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface MenuDividerProps extends HTMLAttributes<HTMLHRElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const MenuDivider = forwardRef<HTMLHRElement, MenuDividerProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('menu-divider', className)

    return <hr className={_className} {...rest} ref={ref} />
  }
)

MenuDivider.displayName = 'MenuDivider'
