import React from 'react'

// Mirrors Chassis CSS's menu.js SELECTOR_VISIBLE_ITEMS / SELECTOR_KB_NAV_ITEMS: direct-child
// menu items and submenu-back buttons, plus submenu trigger items nested one level inside a
// `.submenu` wrapper (which aren't direct children of the `.menu`).
const VISIBLE_ITEMS_SELECTOR = ':is(.menu-item, .submenu-back):not(.disabled):not(:disabled)'
const NAV_ITEMS_SELECTOR = [
  `:scope > ${VISIBLE_ITEMS_SELECTOR}`,
  ':scope > .submenu > .menu-item:not(.disabled):not(:disabled)',
].join(', ')

const isVisible = (element: HTMLElement) =>
  Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length)

export const getMenuItems = (menu: HTMLElement | null): HTMLElement[] => {
  if (!menu) return []
  return Array.from(menu.querySelectorAll<HTMLElement>(NAV_ITEMS_SELECTOR)).filter(isVisible)
}

export const focusMenuItem = (items: HTMLElement[], target: 'first' | 'last') => {
  if (!items.length) return
  ;(target === 'first' ? items[0] : items[items.length - 1]).focus()
}

export interface MenuKeyDownOptions {
  onArrowLeft?: () => void
  onEscape?: () => void
}

// Scoped to `event.currentTarget` (the `.menu` element the handler is bound to), so the same
// function drives keyboard navigation for both the top-level menu and any nested submenu list.
export const handleMenuKeyDown = (
  event: React.KeyboardEvent<HTMLElement>,
  { onArrowLeft, onEscape }: MenuKeyDownOptions,
): void => {
  const menu = event.currentTarget
  const target = event.target as HTMLElement

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      event.preventDefault()
      event.stopPropagation()
      const items = getMenuItems(menu)
      if (!items.length) return
      const currentIndex = items.indexOf(target)
      const nextIndex =
        currentIndex === -1
          ? event.key === 'ArrowDown'
            ? 0
            : items.length - 1
          : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
      items[nextIndex].focus()
      return
    }
    case 'Home':
    case 'End': {
      event.preventDefault()
      event.stopPropagation()
      focusMenuItem(getMenuItems(menu), event.key === 'Home' ? 'first' : 'last')
      return
    }
    case 'Escape': {
      if (!onEscape) return
      event.preventDefault()
      event.stopPropagation()
      onEscape()
      return
    }
    case 'ArrowLeft': {
      if (!onArrowLeft) return
      event.preventDefault()
      event.stopPropagation()
      onArrowLeft()
      return
    }
    default:
  }
}
