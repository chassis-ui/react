import React, { ElementType, forwardRef, HTMLAttributes, useContext } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import { useForkedRef } from '../../utils/hooks'
import { CMenuContext } from './CxMenu'
import { handleMenuKeyDown } from './menuNavigation'
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
    const { close, container, floatingStyles, refs, visible } = useContext(CMenuContext)
    const forkedRef = useForkedRef(ref, refs.setFloating)
    const submenuGroup = useSubmenuGroupProvider()

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      handleMenuKeyDown(event, { onEscape: close })
      onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>)
    }

    const content = (
      <Component
        className={classNames('menu', { show: visible }, className)}
        style={floatingStyles}
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
