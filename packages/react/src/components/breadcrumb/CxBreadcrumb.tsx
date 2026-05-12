import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CxLink } from '../link/CxLink'

export interface CBreadcrumbItemDef {
  /**
   * Label for the breadcrumb item.
   */
  label: React.ReactNode
  /**
   * URL for the breadcrumb link. The last item in the array is always rendered as active (no link needed).
   */
  href?: string
}

export interface CBreadcrumbProps extends HTMLAttributes<HTMLOListElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Array of breadcrumb items for data-driven rendering. The last item is automatically marked active.
   * When provided, children are ignored.
   */
  items?: CBreadcrumbItemDef[]
}

export const CxBreadcrumb = forwardRef<HTMLOListElement, CBreadcrumbProps>(
  ({ children, className, items, ...rest }, ref) => {
    const _className = classNames('breadcrumb', className)

    const autoContent = items
      ? items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li
              key={idx}
              className={classNames('breadcrumb-item', { active: isLast })}
              {...(isLast ? { 'aria-current': 'page' } : {})}
            >
              {!isLast && item.href ? <CxLink href={item.href}>{item.label}</CxLink> : item.label}
            </li>
          )
        })
      : null

    return (
      <nav aria-label="breadcrumb">
        <ol className={_className} {...rest} ref={ref}>
          {autoContent ?? children}
        </ol>
      </nav>
    )
  },
)

CxBreadcrumb.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      href: PropTypes.string,
    }) as PropTypes.Validator<CBreadcrumbItemDef>,
  ),
}

CxBreadcrumb.displayName = 'CxBreadcrumb'
