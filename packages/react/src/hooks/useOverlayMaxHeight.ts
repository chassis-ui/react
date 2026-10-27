import { RefObject, useEffect, useRef } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

// The room a panel keeps, by panel, so that writing it back isn't read as a new placement.
const kept = new WeakMap<HTMLElement, string>()

const fitToRoom = (node: HTMLElement) => {
  const room = node.style.maxHeight
  if (room === kept.get(node)) return
  if (kept.delete(node)) node.style.removeProperty('overflow-y')
  if (!room) return
  node.style.removeProperty('max-height')
  // A `stacked` submenu renders its panel inside the list (`MenuSubmenu`), placed beside its
  // trigger above the `sm` breakpoint: a list that scrolls would clip it. Such a list keeps the
  // theme's cap only, as before 0.5.1.
  if (node.querySelector('.submenu-stacked')) return
  // `none` parses to NaN, which no room reaches: with no cap, the room is the height.
  if (Number.parseFloat(room) >= Number.parseFloat(getComputedStyle(node).maxHeight)) return
  node.style.maxHeight = room
  node.style.overflowY = 'auto'
  kept.set(node, room)
}

// Gives a `.menu` panel the smaller of chassis-css's `--cx-menu-max-height` and the room
// react-aria's `useOverlayPosition` finds for it beside its trigger. The hook writes that room as
// an inline `max-height`, on the element itself rather than in the style it returns, and again each
// time it places the overlay (a resize, the overlay's own size changing). Inline, it outranks the
// theme's cap: a `Combobox` list 360.5px tall against a 320px token. So it is taken off where the
// cap is smaller, and kept where it is the smaller one, with the list scrolling inside it: a menu
// taller than the room on either side of its trigger otherwise runs off the viewport. Each write
// is handled before the paint. A list that holds a `stacked` submenu's panel is left to the cap.
//
// For `Menu`, `MenuSubmenu`, `ContextMenu`, `Combobox` and `Autocomplete`, which take only the
// position from the hook (`resolveMenuOverlayPositioning`). Call it after `useOverlayPosition`, so
// its layout effect runs after the hook's own.
export function useOverlayMaxHeight(overlayRef: RefObject<HTMLElement | null>, isOpen: boolean) {
  const observedRef = useRef<{ node: HTMLElement; observer: MutationObserver } | null>(null)

  // Every commit: the panel can be a new element (a list moved into a dialog), and the hook
  // places it again in its own layout effect.
  useIsomorphicLayoutEffect(() => {
    const node = isOpen ? overlayRef.current : null
    const observed = observedRef.current
    if (node) fitToRoom(node)
    if (observed?.node === node) return
    observed?.observer.disconnect()
    observedRef.current = null
    if (!node || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(() => fitToRoom(node))
    observer.observe(node, { attributes: true, attributeFilter: ['style'] })
    observedRef.current = { node, observer }
  })

  useEffect(
    () => () => {
      observedRef.current?.observer.disconnect()
      observedRef.current = null
    },
    []
  )
}
