import { RefObject, useEffect, useRef } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

const releaseMaxHeight = (node: HTMLElement) => {
  if (node.style.maxHeight) node.style.removeProperty('max-height')
}

// Leaves the height of a `.menu` panel to chassis-css's `--cx-menu-max-height`. react-aria's
// `useOverlayPosition` writes the room it finds for the overlay as an inline `max-height`, on the
// element itself rather than in the style it returns, and again each time it places the overlay
// (a resize, the overlay's own size changing). Inline, that outranks the theme's cap: a
// `Combobox` list 360.5px tall against a 320px token. The value is taken off each time it is
// written, before the paint.
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
    if (node) releaseMaxHeight(node)
    if (observed?.node === node) return
    observed?.observer.disconnect()
    observedRef.current = null
    if (!node || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(() => releaseMaxHeight(node))
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
