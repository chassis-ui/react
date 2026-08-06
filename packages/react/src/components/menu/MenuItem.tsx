import React, { ElementType, forwardRef, ReactNode } from 'react'
import classNames from 'classnames'

import { LinkProps, Link } from '../link/Link'
import { renderMenuItemContent } from './renderMenuItemContent'

export interface MenuItemProps extends LinkProps {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Secondary line of text rendered below `children` (`.menu-item-description`).
   */
  description?: ReactNode
  /**
   * Icon rendered at the item's leading edge (`.menu-item-icon`).
   */
  icon?: ReactNode
  /**
   * Marks the item as the current selection in a choice list. Renders in a heavier font weight.
   * Combine with a manually-composed `.menu-item-check` icon (in `children`, or via `icon` on a
   * plain, non-selection item) to also show a checkmark — this prop alone doesn't add one, so
   * existing font-weight-only usage keeps rendering unchanged.
   */
  selected?: boolean
}

export const MenuItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, MenuItemProps>(
  (
    { children, className, component = 'a', description, href, icon, onClick, selected, ...rest },
    ref
  ) => {
    const _className = classNames('menu-item', { selected }, className)

    // `href="#"` is a common placeholder for menu items that act via `onClick` rather than
    // real navigation. Left alone, a plain anchor click still navigates to the empty fragment,
    // which scrolls the page to the top — so we suppress that default for the placeholder case
    // only, leaving real same-page anchors (`href="#some-id"`) free to navigate as expected.
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (href === '#') event.preventDefault()
      onClick?.(event)
    }

    return (
      <Link
        role="menuitem"
        component={component}
        href={href}
        onClick={handleClick}
        {...rest}
        className={_className}
        ref={ref}
      >
        {renderMenuItemContent({ icon, label: children, description })}
      </Link>
    )
  }
)

MenuItem.displayName = 'MenuItem'
