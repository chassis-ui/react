import React, { AnchorHTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

import { CxLink } from '../link/CxLink'

export interface CxCardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The href attribute specifies the URL of the page the link goes to.
   */
  href?: string
}

export const CxCardLink = forwardRef<HTMLAnchorElement, CxCardLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-link', className)

    return (
      <CxLink className={_className} {...rest} ref={ref}>
        {children}
      </CxLink>
    )
  }
)

CxCardLink.displayName = 'CxCardLink'
