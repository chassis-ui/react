import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxNavItemDef {
  /**
   * Label content for the nav item.
   */
  label: React.ReactNode
  /**
   * URL for the nav link.
   */
  href?: string
  /**
   * Marks the item as active.
   */
  active?: boolean
  /**
   * Marks the item as disabled.
   */
  disabled?: boolean
}

export interface CxNavProps extends HTMLAttributes<
  HTMLDivElement | HTMLUListElement | HTMLOListElement
> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Array of nav item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: CxNavItemDef[]
  /**
   * Specify a layout type for component.
   */
  layout?: 'fill' | 'justified'
  /**
   * Set the nav variant to tabs or pills.
   */
  variant?: 'tabs' | 'pills'
}

export const CxNav = forwardRef<HTMLDivElement | HTMLUListElement | HTMLOListElement, CxNavProps>(
  ({ children, className, component: Component = 'ul', items, layout, variant, ...rest }, ref) => {
    const _className = classNames(
      'nav',
      {
        [`nav-${layout}`]: layout,
        [`nav-${variant}`]: variant
      },
      className
    )

    const autoContent = items
      ? items.map((item, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={idx} className="nav-item">
            <a
              className={classNames('nav-link', { active: item.active, disabled: item.disabled })}
              href={item.href ?? '#'}
              {...(item.active ? { 'aria-current': 'page' } : {})}
              {...(item.disabled ? { tabIndex: -1, 'aria-disabled': true } : {})}
            >
              {item.label}
            </a>
          </li>
        ))
      : null

    return (
      <Component className={_className} role="navigation" {...rest} ref={ref}>
        {autoContent ?? children}
      </Component>
    )
  }
)

CxNav.displayName = 'CxNav'
