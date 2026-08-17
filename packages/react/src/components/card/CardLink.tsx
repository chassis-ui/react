import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Link, LinkProps } from '../link/Link'

export interface CardLinkProps extends LinkProps {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CardLink = forwardRef<HTMLButtonElement | HTMLAnchorElement, CardLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-link', className)

    return (
      <Link className={_className} {...rest} ref={ref}>
        {children}
      </Link>
    )
  }
)

CardLink.displayName = 'CardLink'
