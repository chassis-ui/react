// Safari shows a `:focus-visible` ring on an element focused via script even when the
// interaction that triggered the script was a real pointer click — unlike Chromium/Firefox,
// which correctly suppress it in that case. Force the ring off for a pointer-triggered redirect,
// then let normal focus-visible behavior resume the next time this element is genuinely
// (re)focused, e.g. via Tab.
export function focusRedirect(
  el: HTMLElement | null,
  viaPointer: boolean,
  focusOptions?: FocusOptions
): void {
  if (!el) return
  if (!viaPointer) {
    el.focus(focusOptions)
    return
  }
  const prevOutline = el.style.outline
  const prevBoxShadow = el.style.boxShadow
  el.style.outline = 'none'
  el.style.boxShadow = 'none'
  el.focus(focusOptions)
  el.addEventListener(
    'blur',
    () => {
      el.style.outline = prevOutline
      el.style.boxShadow = prevBoxShadow
    },
    { once: true }
  )
}
