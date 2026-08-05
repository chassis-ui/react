import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface MenuHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const MenuHeader = forwardRef<HTMLHeadingElement, MenuHeaderProps>(
  ({ children, className, component: Component = 'h4', role = 'presentation', ...rest }, ref) => {
    const _className = classNames('menu-header', className)

    // Always rendered as a direct child of `role="menu"` (see MenuList) — ARIA's menu role only
    // permits menuitem/group/separator children, so a bare heading fails aria-required-children.
    // `role="presentation"` opts the element itself out without hiding its text content.
    return (
      <Component className={_className} role={role} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

MenuHeader.displayName = 'MenuHeader'
