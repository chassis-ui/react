import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { CxLink } from '../link/CxLink'

export interface CxBreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The `href` attribute for the inner `<CxLink>` component.
   */
  href?: string
}

export const CxBreadcrumbItem = forwardRef<HTMLLIElement, CxBreadcrumbItemProps>(
  ({ children, active, className, href, ...rest }, ref) => {
    const _className = classNames(
      'breadcrumb-item',
      {
        active: active,
      },
      className,
    )
    return (
      <li className={_className} {...(active && { 'aria-current': 'page' })} {...rest} ref={ref}>
        {href ? <CxLink href={href}>{children}</CxLink> : children}
      </li>
    )
  },
)

CxBreadcrumbItem.displayName = 'CxBreadcrumbItem'
