import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CNavbarTogglerProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxNavbarToggler = forwardRef<HTMLButtonElement, CNavbarTogglerProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('navbar-toggler', className)

    return (
      <button type="button" className={_className} {...rest} ref={ref}>
        {children ? children : <span className="navbar-toggler-icon"></span>}
      </button>
    )
  },
)

CxNavbarToggler.displayName = 'CxNavbarToggler'
