import { suppressFocusRing } from './suppressFocusRingGlobally'

// Safari shows a `:focus-visible` ring on an element focused via script even when the
// interaction that triggered the script was a real pointer click — unlike Chromium/Firefox,
// which correctly suppress it in that case. Force the ring off for a pointer-triggered redirect,
// then let normal focus-visible behavior resume the next time this element is genuinely
// (re)focused, e.g. via Tab.
//
// The suppress/restore cycle itself is `suppressFocusRing`'s, not reimplemented here: it owns the
// re-entrancy guard that keeps a second call before the element blurs from capturing the
// already-suppressed value as the one to restore (which left the ring off for good — reachable by
// clicking twice at the same disabled end of a `ends="stop"` carousel). `boxShadow` is suppressed
// alongside `outline` here, but not on the global pointerdown path, because a redirect can land
// on an element whose ring is painted that way.
export function focusRedirect(
  el: HTMLElement | null,
  viaPointer: boolean,
  focusOptions?: FocusOptions
): void {
  if (!el) return
  if (viaPointer) suppressFocusRing(el, ['outline', 'boxShadow'])
  el.focus(focusOptions)
}
