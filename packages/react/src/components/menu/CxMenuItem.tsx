import React, { ElementType, forwardRef } from 'react'
import classNames from 'classnames'

import { CxLinkProps, CxLink } from '../link/CxLink'

export interface CxMenuItemProps extends CxLinkProps {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Marks the item as the current selection in a choice list. Renders in a heavier font
   * weight. Combine with a `.menu-item-check` icon to show a checkmark on the selected item.
   */
  selected?: boolean
}

export const CxMenuItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, CxMenuItemProps>(
  ({ children, className, component = 'a', selected, ...rest }, ref) => {
    const _className = classNames('menu-item', { selected }, className)

    return (
      <CxLink role="menuitem" component={component} {...rest} className={_className} ref={ref}>
        {children}
      </CxLink>
    )
  }
)

CxMenuItem.displayName = 'CxMenuItem'
