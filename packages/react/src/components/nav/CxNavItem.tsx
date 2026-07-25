import React, { forwardRef } from 'react'
import classNames from 'classnames'
import { CxNavLink, CxNavLinkProps } from './CxNavLink'

export const CxNavItem = forwardRef<HTMLLIElement, CxNavLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('nav-item', className)
    if (rest.href || rest.to) {
      children = (
        <CxNavLink className={className} {...rest}>
          {children}
        </CxNavLink>
      )
    }
    return (
      <li className={_className} ref={ref}>
        {children}
      </li>
    )
  },
)

CxNavItem.displayName = 'CxNavItem'
