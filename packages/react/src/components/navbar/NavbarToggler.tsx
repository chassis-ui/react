import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Icon } from '../icon/Icon'

export interface NavbarTogglerProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The accessible label announced by assistive technology when no children are provided.
   */
  label?: string
}

export const NavbarToggler = forwardRef<HTMLButtonElement, NavbarTogglerProps>(
  ({ children, className, label = 'Toggle navigation', ...rest }, ref) => {
    const _className = classNames('button icon-only navbar-toggler', className)

    return (
      <button type="button" className={_className} {...rest} ref={ref}>
        {children ?? (
          <>
            <Icon name="bars-outline" className="navbar-toggler-icon" />
            <span className="visually-hidden">{label}</span>
          </>
        )}
      </button>
    )
  }
)

NavbarToggler.displayName = 'NavbarToggler'
