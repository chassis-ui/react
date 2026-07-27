import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { CxLink } from '../link/CxLink'

export interface CxPaginationItemProps extends HTMLAttributes<HTMLAnchorElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The href attribute. When provided the item renders as an `<a>` tag; otherwise as a `<button>`.
   */
  href?: string
}

export const CxPaginationItem = forwardRef<HTMLAnchorElement, CxPaginationItemProps>(
  ({ children, className, component, ...rest }, ref) => {
    const _className = classNames(
      'page-item',
      {
        active: rest.active,
        disabled: rest.disabled
      },
      className
    )

    const Component = component ? component : rest.active ? 'span' : rest.href ? 'a' : 'button'

    return (
      <li className={_className} {...(rest.active && { 'aria-current': 'page' })}>
        {Component === 'a' || Component === 'button' ? (
          <CxLink className="page-link" component={Component} {...rest} ref={ref}>
            {children}
          </CxLink>
        ) : (
          <Component className="page-link" ref={ref}>
            {children}
          </Component>
        )}
      </li>
    )
  }
)

CxPaginationItem.displayName = 'CxPaginationItem'
