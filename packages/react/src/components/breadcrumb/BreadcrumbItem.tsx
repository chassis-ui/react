import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Link } from '../link/Link'

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The `href` attribute for the inner `<Link>` component.
   */
  href?: string
}

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ children, active, className, href, ...rest }, ref) => {
    const _className = classNames(
      'breadcrumb-item',
      {
        active: active
      },
      className
    )
    return (
      <li className={_className} {...(active && { 'aria-current': 'page' })} {...rest} ref={ref}>
        {href ? <Link href={href}>{children}</Link> : children}
      </li>
    )
  }
)

BreadcrumbItem.displayName = 'BreadcrumbItem'
