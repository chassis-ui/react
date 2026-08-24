import React, { forwardRef } from 'react'
import classNames from 'classnames'
import { NavLink, NavLinkProps } from './NavLink'

export const NavItem = forwardRef<HTMLLIElement, NavLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('nav-item', className)
    if (rest.href || rest.to) {
      children = <NavLink {...rest}>{children}</NavLink>
    }
    return (
      <li className={_className} ref={ref}>
        {children}
      </li>
    )
  }
)

NavItem.displayName = 'NavItem'
