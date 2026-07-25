import React, { ElementType, forwardRef } from 'react'
import classNames from 'classnames'

import { CxLinkProps, CxLink } from '../link/CxLink'
export interface CxNavLinkProps extends CxLinkProps {
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

export const CxNavLink = forwardRef<HTMLButtonElement | HTMLAnchorElement, CxNavLinkProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('nav-link', className)

    return (
      <CxLink className={_className} {...rest} ref={ref}>
        {children}
      </CxLink>
    )
  },
)

CxNavLink.displayName = 'CxNavLink'
