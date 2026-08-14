import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Link } from '../link/Link'

export interface PaginationItemProps extends HTMLAttributes<HTMLAnchorElement> {
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

export const PaginationItem = forwardRef<HTMLAnchorElement, PaginationItemProps>(
  ({ active, children, className, component, disabled, href, ...rest }, ref) => {
    const _className = classNames(
      'pagination-item',
      {
        active,
        disabled
      },
      className
    )

    const Component = component ? component : active ? 'span' : href ? 'a' : 'button'

    return (
      <li className={_className} {...(active && { 'aria-current': 'page' })}>
        {Component === 'a' || Component === 'button' ? (
          <Link
            className="pagination-link"
            component={Component}
            active={active}
            disabled={disabled}
            href={href}
            {...(Component === 'button' && { type: 'button' })}
            {...rest}
            ref={ref}
          >
            {children}
          </Link>
        ) : (
          <Component className="pagination-link" {...rest} ref={ref}>
            {children}
          </Component>
        )}
      </li>
    )
  }
)

PaginationItem.displayName = 'PaginationItem'
