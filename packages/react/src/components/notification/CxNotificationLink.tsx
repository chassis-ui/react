import React, { AnchorHTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

import { Link } from '../link/Link'

export interface CxNotificationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxNotificationLink = forwardRef<HTMLAnchorElement, CxNotificationLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('notification-link', className)

    return (
      <Link className={_className} {...rest} ref={ref}>
        {children}
      </Link>
    )
  }
)

CxNotificationLink.displayName = 'CxNotificationLink'
