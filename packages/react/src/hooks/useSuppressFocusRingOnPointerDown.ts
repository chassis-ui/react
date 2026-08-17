import { PointerEvent, useRef } from 'react'

// Chromium/WebKit's `:focus-visible` heuristic has no interaction history to consult on the very
// first focus event of a page load, so a genuine pointer press can still paint a focus ring as if
// it came from the keyboard — most visible on whatever button-like element happens to be the
// first thing a visitor clicks. Suppress the ring for the duration of the press, before the
// browser's default action grants focus and paints it, then restore whatever outline was there
// once the element blurs. Safe to run on every press, not just the page's first: if the browser
// was already going to correctly withhold the ring, this suppress/restore cycle is a no-op within
// the same frame. `suppressedOutlineRef` guards re-entrancy — a second pointerdown while the first
// press is still focused would otherwise stack a second blur listener that clobbers the first
// restoration and leaves the ring permanently suppressed.
export function useSuppressFocusRingOnPointerDown<T extends HTMLElement = HTMLElement>(): (
  event: PointerEvent<T>
) => void {
  const suppressedOutlineRef = useRef<string | null>(null)

  return (event: PointerEvent<T>) => {
    const el = event.currentTarget
    if (suppressedOutlineRef.current !== null) return
    suppressedOutlineRef.current = el.style.outline
    el.style.outline = 'none'
    el.addEventListener(
      'blur',
      () => {
        el.style.outline = suppressedOutlineRef.current ?? ''
        suppressedOutlineRef.current = null
      },
      { once: true }
    )
  }
}
