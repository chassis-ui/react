import { MouseEvent, RefObject, useEffect, useRef } from 'react'

import { focusRedirect } from '../utils/focusRedirect'

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

export interface UsePaginationResult<T extends HTMLElement = HTMLButtonElement> {
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

// Native `disabled` buttons are blurred by the browser the instant they're disabled. Clicking a
// Prev/Next control into the first/last page disables that very control, silently dropping focus
// to `<body>`. Wire `handlePrevClick`/`handleNextClick` up as each control's `onClick` — they call
// `onPrev`/`onNext` and redirect focus to the still-enabled sibling in one step, so callers don't
// hand-wrap their own click handler around a separate mark-then-focus call.
// Works for `Pagination`'s built-in smart mode and for hand-composed Prev/Next controls alike —
// pass the element type of whatever you're attaching the refs to (`PaginationItem` defaults to
// an `HTMLButtonElement`, but renders an `HTMLAnchorElement` when given `href` or `component`).
export function usePagination<T extends HTMLElement = HTMLButtonElement>({
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
