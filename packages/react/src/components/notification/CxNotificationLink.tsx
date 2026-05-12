import React, { AnchorHTMLAttributes, forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CxLink } from '../link/CxLink'

export interface CNotificationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxNotificationLink = forwardRef<HTMLAnchorElement, CNotificationLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('notification-link', className)

    return (
      <CxLink className={_className} {...rest} ref={ref}>
        {children}
      </CxLink>
    )
  },
)

CxNotificationLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

CxNotificationLink.displayName = 'CxNotificationLink'
