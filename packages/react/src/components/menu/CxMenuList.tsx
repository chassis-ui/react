import React, {
  ElementType,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { CxMenuContext } from './CxMenu'
import { CxMenuDivider } from './CxMenuDivider'
import { CxMenuHeader } from './CxMenuHeader'
import { CxMenuItem } from './CxMenuItem'
import { CxMenuItemsDef } from './CxMenuItemDef'
import { focusMenuItem, getMenuItems, handleMenuKeyDown } from './menuNavigation'
import { renderMenuItemContent } from './renderMenuItemContent'
import { SubmenuGroupContext, useSubmenuGroupProvider } from './submenuGroup'

export interface CxMenuListProps extends HTMLAttributes<HTMLElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. Covers flat items, headers, and dividers only — for nested submenus, compose
   * with `children` and `CxSubmenu` instead.
   */
  items?: CxMenuItemsDef
}

const renderMenuItemDef = (def: CxMenuItemsDef[number]): ReactNode => {
  if (def.type === 'header') {
    return <CxMenuHeader key={def.id}>{def.label}</CxMenuHeader>
  }
  if (def.type === 'divider') {
    return <CxMenuDivider key={def.id} />
  }
  return (
    <CxMenuItem
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
    </CxMenuItem>
  )
}

export const CxMenuList = forwardRef<HTMLElement, CxMenuListProps>(
  ({ children, className, component: Component = 'div', items, onKeyDown, ...rest }, ref) => {
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
    } = useContext(CxMenuContext)
    const forkedRef = useForkedRef(ref, overlayRef)
    const submenuGroup = useSubmenuGroupProvider()

    // ArrowDown/ArrowUp on the trigger opens the menu with a focus strategy (see `CxMenu`'s
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
)

CxMenuList.displayName = 'CxMenuList'
