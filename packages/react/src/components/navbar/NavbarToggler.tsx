import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { useSuppressFocusRingOnPointerDown } from '../../hooks'
import { Icon } from '../icon/Icon'

export interface NavbarTogglerProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const NavbarToggler = forwardRef<HTMLButtonElement, NavbarTogglerProps>(
  ({ children, className, onPointerDown, ...rest }, ref) => {
    const _className = classNames('button icon-only navbar-toggler', className)
    const suppressFocusRing = useSuppressFocusRingOnPointerDown<HTMLButtonElement>()

    return (
      <button
        type="button"
        className={_className}
        {...rest}
        onPointerDown={(event) => {
          suppressFocusRing(event)
          onPointerDown?.(event)
        }}
        ref={ref}
      >
        {children ? children : <Icon name="bars-outline" className="navbar-toggler-icon" />}
      </button>
    )
  }
)

NavbarToggler.displayName = 'NavbarToggler'
