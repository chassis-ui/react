import { MouseEvent, RefObject, useEffect, useRef } from 'react'

export interface UsePaginationOptions {
  /**
   * Whether the Previous control is currently disabled.
   */
  prevDisabled: boolean
  /**
   * Whether the Next control is currently disabled.
   */
  nextDisabled: boolean
  /**
   * Called when Previous is clicked, before the state change that may disable it.
   */
  onPrev: () => void
  /**
   * Called when Next is clicked, before the state change that may disable it.
   */
  onNext: () => void
}

export interface UsePaginationResult<T extends HTMLElement = HTMLAnchorElement> {
  prevRef: RefObject<T>
  nextRef: RefObject<T>
  handlePrevClick: (event: MouseEvent<T>) => void
  handleNextClick: (event: MouseEvent<T>) => void
}

interface Pending {
  from: 'prev' | 'next'
  // A `click` fired by real pointer activation has `detail >= 1`; one fired by keyboard
  // activation (Enter/Space on a focused button) has `detail === 0`.
  viaPointer: boolean
}

// Safari shows a `:focus-visible` ring on an element focused via script even when the
// interaction that triggered the script was a real pointer click — unlike Chromium/Firefox,
// which correctly suppress it in that case. Force the ring off for a pointer-triggered redirect,
// then let normal focus-visible behavior resume the next time this element is genuinely
// (re)focused, e.g. via Tab.
function focusRedirect(el: HTMLElement | null, viaPointer: boolean) {
  if (!el) return
  if (!viaPointer) {
    el.focus()
    return
  }
  const prevOutline = el.style.outline
  const prevBoxShadow = el.style.boxShadow
  el.style.outline = 'none'
  el.style.boxShadow = 'none'
  el.focus()
  el.addEventListener(
    'blur',
    () => {
      el.style.outline = prevOutline
      el.style.boxShadow = prevBoxShadow
    },
    { once: true }
  )
}

// Native `disabled` buttons are blurred by the browser the instant they're disabled. Clicking a
// Prev/Next control into the first/last page disables that very control, silently dropping focus
// to `<body>`. Wire `handlePrevClick`/`handleNextClick` up as each control's `onClick` — they call
// `onPrev`/`onNext` and redirect focus to the still-enabled sibling in one step, so callers don't
// hand-wrap their own click handler around a separate mark-then-focus call.
// Works for `Pagination`'s built-in smart mode and for hand-composed Prev/Next controls alike —
// pass the element type of whatever you're attaching the refs to (`PaginationItem` renders an
// `HTMLAnchorElement`, a plain `Button` an `HTMLButtonElement`, etc).
export function usePagination<T extends HTMLElement = HTMLAnchorElement>({
  prevDisabled,
  nextDisabled,
  onPrev,
  onNext
}: UsePaginationOptions): UsePaginationResult<T> {
  const prevRef = useRef<T>(null)
  const nextRef = useRef<T>(null)
  const pending = useRef<Pending | null>(null)

  // Deliberately no dependency array: this must run after every render, not just ones where
  // prevDisabled/nextDisabled change value. A Prev/Next click that doesn't cross a boundary
  // (e.g. moving between two enabled middle pages) leaves both booleans unchanged, so a
  // dependency-gated effect would skip and leave `pending` stale — a later, unrelated render
  // that does flip one of the booleans (e.g. jumping straight to the first/last page via a
  // page-number click) would then wrongly consume that stale mark and redirect focus.
  useEffect(() => {
    const from = pending.current
    pending.current = null
    if (!from) return
    if (from.from === 'prev' && prevDisabled) {
      focusRedirect(nextRef.current, from.viaPointer)
    } else if (from.from === 'next' && nextDisabled) {
      focusRedirect(prevRef.current, from.viaPointer)
    }
  })

  return {
    prevRef,
    nextRef,
    handlePrevClick: (event) => {
      pending.current = { from: 'prev', viaPointer: event.detail !== 0 }
      onPrev()
    },
    handleNextClick: (event) => {
      pending.current = { from: 'next', viaPointer: event.detail !== 0 }
      onNext()
    }
  }
}
