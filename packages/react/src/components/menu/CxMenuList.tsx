import React, { ElementType, forwardRef, HTMLAttributes, useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import { useForkedRef } from '../../utils/hooks'
import { CMenuContext } from './CxMenu'
import { focusMenuItem, getMenuItems, handleMenuKeyDown } from './menuNavigation'
import { SubmenuGroupContext, useSubmenuGroupProvider } from './submenuGroup'

export interface CMenuListProps extends HTMLAttributes<HTMLElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxMenuList = forwardRef<HTMLElement, CMenuListProps>(
  ({ children, className, component: Component = 'div', onKeyDown, ...rest }, ref) => {
    const {
      close,
      container,
      focusStrategy,
      menuId,
      menuStyle,
      overlayRef,
      placementAttr,
      triggerId,
      visible,
    } = useContext(CMenuContext)
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
        <SubmenuGroupContext.Provider value={submenuGroup}>{children}</SubmenuGroupContext.Provider>
      </Component>
    )

    if (container) {
      if (typeof window === 'undefined') return null
      return createPortal(content, container === true ? document.body : container)
    }

    return content
  },
)

CxMenuList.displayName = 'CxMenuList'
