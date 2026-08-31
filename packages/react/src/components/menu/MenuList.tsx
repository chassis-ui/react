import React, {
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  ReactNode,
  useContext,
  useEffect
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { renderMenuItemContent } from '../../utils/renderMenuItemContent'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { MenuContext } from './Menu'
import { MenuDivider } from './MenuDivider'
import { MenuHeader } from './MenuHeader'
import { MenuItem } from './MenuItem'
import { MenuItemsDef } from './MenuItemDef'
import { focusMenuItem, getMenuItems, handleMenuKeyDown } from './menuNavigation'
import { SubmenuGroupContext, useSubmenuGroupProvider } from './submenuGroup'

type MenuListOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. Covers flat items, headers, and dividers only — for nested submenus, compose
   * with `children` and `MenuSubmenu` instead.
   */
  items?: MenuItemsDef
}

export type MenuListProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  MenuListOwnProps<C>
>

type MenuListComponent = (<C extends ElementType = 'div'>(
  props: MenuListProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

const renderMenuItemDef = (def: MenuItemsDef[number]): ReactNode => {
  if (def.type === 'header') {
    return <MenuHeader key={def.id}>{def.label}</MenuHeader>
  }
  if (def.type === 'divider') {
    return <MenuDivider key={def.id} />
  }
  return (
    <MenuItem
      key={def.id}
      component={def.href ? 'a' : 'button'}
      href={def.href}
      disabled={def.disabled}
      selected={def.selected}
      onClick={def.onClick}
    >
      {renderMenuItemContent({
        icon: def.icon,
        label: def.label,
        description: def.description,
        selected: def.selected
      })}
    </MenuItem>
  )
}

function MenuListRender<C extends ElementType = 'div'>(
  { children, className, component, items, onKeyDown, ...rest }: MenuListProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const {
    close,
    container,
    focusStrategy,
    menuId,
    menuStyle,
    overlayRef,
    placementAttr,
    triggerId,
    visible
  } = useContext(MenuContext)
  const forkedRef = useForkedRef(ref, overlayRef)
  const submenuGroup = useSubmenuGroupProvider()

  // ArrowDown/ArrowUp on the trigger opens the menu with a focus strategy (see `Menu`'s
  // `useMenuTrigger` wiring) — this is where that intent actually lands, since we're not
  // adopting `useMenu`'s own collection-aware auto-focus.
  useEffect(() => {
    if (!visible || !focusStrategy) return
    focusMenuItem(getMenuItems(overlayRef.current), focusStrategy === 'last' ? 'last' : 'first')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, focusStrategy])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    handleMenuKeyDown(event, { onEscape: close })
    onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>)
  }

  const content = (
    <Component
      role="menu"
      id={menuId}
      aria-labelledby={triggerId}
      className={classNames('menu', { show: visible }, className)}
      style={menuStyle}
      data-cx-placement={placementAttr}
      aria-hidden={!visible}
      {...rest}
      onKeyDown={handleKeyDown}
      ref={forkedRef}
    >
      <SubmenuGroupContext.Provider value={submenuGroup}>
        {items ? items.map(renderMenuItemDef) : children}
      </SubmenuGroupContext.Provider>
    </Component>
  )

  if (container) {
    if (typeof window === 'undefined') return null
    return createPortal(content, container === true ? document.body : container)
  }

  return content
}

export const MenuList = createPolymorphicComponent<MenuListComponent>(
  MenuListRender as ForwardRefRenderFunction<Element, MenuListProps<ElementType>>,
  'MenuList'
)
