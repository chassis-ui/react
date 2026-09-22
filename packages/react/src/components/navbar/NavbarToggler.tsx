import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { IconValue } from '../../utils/iconConfig'
import { IconSlot } from '../../utils/iconSlot'

export interface NavbarTogglerProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The toggler icon: an icon name, or an element of your own icon set. Defaults to
   * `IconProvider`'s `menu` icon.
   */
  icon?: IconValue
  /**
   * The accessible label announced by assistive technology when no children are provided.
   */
  label?: string
}

export const NavbarToggler = forwardRef<HTMLButtonElement, NavbarTogglerProps>(
  ({ children, className, icon, label = 'Toggle navigation', ...rest }, ref) => {
    const _className = classNames('button icon-only navbar-toggler', className)

    return (
      <button type="button" className={_className} {...rest} ref={ref}>
        {children ?? (
          <>
            <IconSlot icon="menu" override={icon} className="navbar-toggler-icon" />
            <span className="visually-hidden">{label}</span>
          </>
        )}
      </button>
    )
  }
)

NavbarToggler.displayName = 'NavbarToggler'
