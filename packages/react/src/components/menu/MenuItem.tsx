import React, {
  ElementType,
  ForwardRefRenderFunction,
  MouseEvent,
  ReactElement,
  ReactNode
} from 'react'
import classNames from 'classnames'

import { createPolymorphicComponent, PolymorphicRef } from '../../utils/polymorphic'
import { renderMenuItemContent } from '../../utils/renderMenuItemContent'
import { LinkProps, Link } from '../link/Link'

type MenuItemOwnProps = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
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

export type MenuItemProps<C extends ElementType = 'a'> = LinkProps<C> & MenuItemOwnProps

type MenuItemComponent = (<C extends ElementType = 'a'>(
  props: MenuItemProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function MenuItemRender<C extends ElementType = 'a'>(
  {
    children,
    className,
    component,
    description,
    href,
    icon,
    onClick,
    selected,
    ...rest
  }: MenuItemProps<C>,
  ref: PolymorphicRef<C>
) {
  const _className = classNames('menu-item', { selected }, className)

  // `href="#"` is a common placeholder for menu items that act via `onClick` rather than
  // real navigation. Left alone, a plain anchor click still navigates to the empty fragment,
  // which scrolls the page to the top — so we suppress that default for the placeholder case
  // only, leaving real same-page anchors (`href="#some-id"`) free to navigate as expected.
  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (href === '#') event.preventDefault()
    onClick?.(event)
  }

  return (
    <Link
      role="menuitem"
      component={component as ElementType}
      href={href}
      onClick={handleClick}
      {...(rest as Record<string, unknown>)}
      className={_className}
      ref={ref as PolymorphicRef<ElementType>}
    >
      {renderMenuItemContent({ icon, label: children, description })}
    </Link>
  )
}

export const MenuItem = createPolymorphicComponent<MenuItemComponent>(
  MenuItemRender as ForwardRefRenderFunction<Element, MenuItemProps<ElementType>>,
  'MenuItem'
)
