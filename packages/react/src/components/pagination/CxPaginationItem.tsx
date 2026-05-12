import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CxLink } from '../link/CxLink'

export interface CPaginationItemProps extends HTMLAttributes<HTMLAnchorElement> {
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
}

export const CxPaginationItem = forwardRef<HTMLAnchorElement, CPaginationItemProps>(
  ({ children, className, component, ...rest }, ref) => {
    const _className = classNames(
      'page-item',
      {
        active: rest.active,
        disabled: rest.disabled,
      },
      className,
    )

    const Component = component ? component : rest.active ? 'span' : 'a'

    return (
      <li className={_className} {...(rest.active && { 'aria-current': 'page' })}>
        {Component === 'a' ? (
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
  },
)

CxPaginationItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
}

CxPaginationItem.displayName = 'CxPaginationItem'
