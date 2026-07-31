import React, { ElementType, forwardRef, ReactNode } from 'react'
import classNames from 'classnames'

import { CxLinkProps, CxLink } from '../link/CxLink'
import { renderMenuItemContent } from './renderMenuItemContent'

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

export const CxMenuItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, CxMenuItemProps>(
  ({ children, className, component = 'a', description, icon, selected, ...rest }, ref) => {
    const _className = classNames('menu-item', { selected }, className)

    return (
      <CxLink role="menuitem" component={component} {...rest} className={_className} ref={ref}>
        {renderMenuItemContent({ icon, label: children, description })}
      </CxLink>
    )
  }
)

CxMenuItem.displayName = 'CxMenuItem'
