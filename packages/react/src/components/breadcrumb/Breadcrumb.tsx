import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { BreadcrumbItem } from './BreadcrumbItem'

export interface BreadcrumbItemDef {
  /**
   * Label for the breadcrumb item.
   */
  label: React.ReactNode
  /**
   * URL for the breadcrumb link. The last item in the array is always rendered as active (no link needed).
   */
  href?: string
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLOListElement> {
  /**
   * Accessible name of the wrapping `<nav>` landmark. Defaults to the English `'breadcrumb'`;
   * override it to translate the landmark, or to tell two breadcrumb trails on the same page
   * apart (landmarks of the same role need distinct names to be distinguishable in a screen
   * reader's landmark list).
   *
   * @default 'breadcrumb'
   */
  'aria-label'?: string
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Array of breadcrumb items for data-driven rendering. The last item is automatically marked active.
   * When provided, children are ignored.
   */
  items?: BreadcrumbItemDef[]
}

export const Breadcrumb = forwardRef<HTMLOListElement, BreadcrumbProps>(
  ({ 'aria-label': ariaLabel = 'breadcrumb', children, className, items, ...rest }, ref) => {
    const _className = classNames('breadcrumb', className)

    const autoContent = items
      ? items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <BreadcrumbItem
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              active={isLast}
              href={isLast ? undefined : item.href}
            >
              {item.label}
            </BreadcrumbItem>
          )
        })
      : null

    return (
      <nav aria-label={ariaLabel}>
        <ol className={_className} {...rest} ref={ref}>
          {autoContent ?? children}
        </ol>
      </nav>
    )
  }
)

Breadcrumb.displayName = 'Breadcrumb'
