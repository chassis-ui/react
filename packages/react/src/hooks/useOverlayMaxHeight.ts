import { RefObject, useEffect, useRef } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

// The room a panel keeps, by panel, so that writing it back isn't read as a new placement.
const kept = new WeakMap<HTMLElement, string>()

const holdsPlacedStackedPanel = (node: HTMLElement) =>
  Array.from(node.querySelectorAll('.submenu-stacked')).some(
    (panel) => getComputedStyle(panel).position !== 'static'
  )

const releaseRoom = (node: HTMLElement) => {
  if (node.style.maxHeight) node.style.removeProperty('max-height')
}

const fitToRoom = (node: HTMLElement) => {
  const room = node.style.maxHeight
  if (room === kept.get(node)) return
  if (kept.delete(node)) node.style.removeProperty('overflow-y')
  if (!room) return
  node.style.removeProperty('max-height')
  // A `stacked` submenu renders its panel inside the list (`MenuSubmenu`), placed beside its
  // trigger above the `sm` breakpoint: a list that scrolls would clip it. Such a list keeps the
  // theme's cap only, as before 0.5.1. Below it, chassis-css makes the panel `position: static`,
  // in the list's flow, and the list keeps the room: a tall menu on a phone runs off the screen
  // otherwise. Crossing the breakpoint is a resize, which places the list again.
  if (holdsPlacedStackedPanel(node)) return
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
// is handled before the paint. A list that holds a `stacked` submenu's panel placed beside its
// trigger is left to the cap.
//
// For `Menu`, `MenuSubmenu`, `ContextMenu`, `Combobox` and `Autocomplete`, which take only the
// position from the hook (`resolveMenuOverlayPositioning`). Call it after `useOverlayPosition`, so
// its layout effect runs after the hook's own.
//
// `Popover` and `Tooltip` `release` the room instead: their panels have no cap of their own to
// fit under, and an arrow at their edge that a scrolling panel would clip, so each is as tall as
// its content, as chassis-css's own popovers are. Kept, the room clipped a popover's content
// inside its border, and a tooltip's was `0px` where react-aria placed it before it had a size.
export function useOverlayMaxHeight(
  overlayRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  mode: 'fit' | 'release' = 'fit'
) {
  const observedRef = useRef<{ node: HTMLElement; observer: MutationObserver } | null>(null)
  const place = mode === 'fit' ? fitToRoom : releaseRoom

  // Every commit: the panel can be a new element (a list moved into a dialog), and the hook
  // places it again in its own layout effect.
  useIsomorphicLayoutEffect(() => {
    const node = isOpen ? overlayRef.current : null
    const observed = observedRef.current
    if (node) place(node)
    if (observed?.node === node) return
    observed?.observer.disconnect()
    observedRef.current = null
    if (!node || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(() => place(node))
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
