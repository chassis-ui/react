// Tracks, per-element, whether its most recent activation came from a real pointer click rather
// than a keyboard one (a `click` fired by pointer activation has `detail >= 1`; one fired by
// keyboard activation, e.g. Enter/Space on a focused button, has `detail === 0`) — for callers
// that need that information later, asynchronously, once React has committed the state update the
// click triggered (see `Carousel.tsx`'s disabled-end focus redirect, which needs it to decide
// whether `focusRedirect` should suppress Safari's script-focus-after-pointer-click ring). A
// `WeakSet` rather than a DOM attribute so it doesn't leak into markup/snapshots, and consuming it
// clears the entry so a later, unrelated keyboard activation on the same element isn't
// misattributed as pointer-triggered.
const pointerClicks = new WeakSet<HTMLElement>()

export function markPointerClick(el: HTMLElement): void {
  pointerClicks.add(el)
}

export function consumePointerClick(el: HTMLElement | null): boolean {
  if (!el) return false
  const wasPointer = pointerClicks.has(el)
  pointerClicks.delete(el)
  return wasPointer
}
