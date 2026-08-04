import React, { ElementType, forwardRef } from 'react'
import classNames from 'classnames'

import { LinkProps, Link } from '../link/Link'
export interface NavLinkProps extends LinkProps {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * @ignore
   */
  to?: string
}

export const NavLink = forwardRef<HTMLButtonElement | HTMLAnchorElement, NavLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('nav-link', className)

    return (
      <Link className={_className} {...rest} ref={ref}>
        {children}
      </Link>
    )
  }
)

NavLink.displayName = 'NavLink'
