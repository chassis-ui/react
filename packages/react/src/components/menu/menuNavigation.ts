import React from 'react'

// Mirrors Chassis CSS's menu.js SELECTOR_VISIBLE_ITEMS / SELECTOR_KB_NAV_ITEMS: direct-child
// menu items and submenu-back buttons, plus submenu trigger items nested one level inside a
// `.submenu` wrapper (which aren't direct children of the `.menu`).
//
// Walks `children` directly rather than a `:scope`-based `querySelectorAll` — jsdom's selector
// engine (nwsapi) mis-parses `:scope` queries against an element whose `id` contains a colon,
// which is exactly the shape of React 18's default `useId()` output now that `MenuList`/
// `MenuSubmenu` set a real `id` for `aria-controls`/`aria-labelledby` linking. Real browsers don't
// have this bug, but walking children is just as correct and sidesteps it either way.
const VISIBLE_ITEMS_SELECTOR = ':is(.menu-item, .submenu-back):not(.disabled):not(:disabled)'

const isVisible = (element: HTMLElement) =>
  Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length)

export const getMenuItems = (menu: HTMLElement | null): HTMLElement[] => {
  if (!menu) return []
  const items: HTMLElement[] = []
  for (const child of Array.from(menu.children)) {
    if (child.matches(VISIBLE_ITEMS_SELECTOR)) {
      items.push(child as HTMLElement)
    } else if (child.classList.contains('submenu')) {
      const trigger = Array.from(child.children).find((grandchild) =>
        grandchild.matches(VISIBLE_ITEMS_SELECTOR)
      )
      if (trigger) items.push(trigger as HTMLElement)
    }
  }
  return items.filter(isVisible)
}

export const focusMenuItem = (items: HTMLElement[], target: 'first' | 'last') => {
  if (!items.length) return
  ;(target === 'first' ? items[0]! : items[items.length - 1]!).focus()
}

export interface MenuKeyDownOptions {
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEscape?: () => void
}

// Scoped to `event.currentTarget` (the `.menu` element the handler is bound to), so the same
// function drives keyboard navigation for both the top-level menu and any nested submenu list.
// `onArrowLeft`/`onArrowRight` are both optional and independent (rather than a single
// direction-agnostic "close" callback) so a caller under an RTL locale can wire the one that
// actually points back toward the trigger — see `MenuSubmenu`, the only current consumer of
// either.
export const handleMenuKeyDown = (
  event: React.KeyboardEvent<HTMLElement>,
  { onArrowLeft, onArrowRight, onEscape }: MenuKeyDownOptions
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
      // `nextIndex` is always a valid index into `items` here (0, items.length - 1, or a modulo
      // result — the `if (!items.length) return` above already ruled out the empty-array case).
      items[nextIndex]!.focus()
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
    case 'ArrowRight': {
      if (!onArrowRight) return
      event.preventDefault()
      event.stopPropagation()
      onArrowRight()
      return
    }
    default:
  }
}
