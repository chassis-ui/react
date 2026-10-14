import { useCallback, useEffect, useRef } from 'react'

export interface UseAutoDismissOptions {
  /**
   * Enables the auto-dismiss timer. When `false`, `onHide` is never called and the returned
   * handlers are no-ops.
   */
  enabled?: boolean
  /**
   * Delay in ms before `onHide` fires once the timer is (re)started. One a timer can't hold (not
   * finite, or over 2^31 - 1 ms) runs no timer.
   */
  delay?: number
  /**
   * Whether the dismissible element is currently visible. The timer only runs while `true`.
   */
  visible: boolean
  /**
   * Called once the delay elapses without an intervening pointer/focus interaction.
   */
  onHide: () => void
}

export interface UseAutoDismissResult {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onFocus: () => void
  onBlur: () => void
}

// The longest delay `setTimeout` holds. A longer one, `Infinity` included, fires at once.
const MAX_TIMEOUT_DELAY = 2 ** 31 - 1

// Shared timer logic for components that auto-dismiss after a delay, pausing while the pointer
// or focus is on the element (mirrors the behavior `Toast` already implements). Extracted so new
// auto-dismissing components don't reimplement the pause/resume bookkeeping.
export function useAutoDismiss({
  enabled = false,
  delay = 5000,
  visible,
  onHide
}: UseAutoDismissOptions): UseAutoDismissResult {
  // `useRef<number>()` (no argument) isn't valid under @types/react 19 — the overload requires
  // an initial value, and the ref has to admit `undefined` for `clearAutoDismissTimeout` to reset
  // it back to "no timer scheduled".
  const timeout = useRef<number | undefined>(undefined)
  const hasMouseInteraction = useRef(false)
  const hasKeyboardInteraction = useRef(false)

  const clearAutoDismissTimeout = useCallback(() => {
    clearTimeout(timeout.current)
    timeout.current = undefined
  }, [])

  const maybeScheduleHide = useCallback(() => {
    clearAutoDismissTimeout()
    if (
      !enabled ||
      !Number.isFinite(delay) ||
      delay > MAX_TIMEOUT_DELAY ||
      hasMouseInteraction.current ||
      hasKeyboardInteraction.current
    ) {
      return
    }
    timeout.current = window.setTimeout(onHide, delay)
  }, [enabled, delay, onHide, clearAutoDismissTimeout])

  // Clears on unmount.
  useEffect(() => clearAutoDismissTimeout, [clearAutoDismissTimeout])

  useEffect(() => {
    if (visible) {
      maybeScheduleHide()
    } else {
      clearAutoDismissTimeout()
      // A hidden element has no pointer or focus on it, and one hidden while it had them (by its
      // close button, which takes focus) gets no `mouseleave` or `blur` to say so: shown again,
      // it would never dismiss itself.
      hasMouseInteraction.current = false
      hasKeyboardInteraction.current = false
    }
  }, [visible, enabled, delay, maybeScheduleHide, clearAutoDismissTimeout])

  const onMouseEnter = useCallback(() => {
    hasMouseInteraction.current = true
    clearAutoDismissTimeout()
  }, [clearAutoDismissTimeout])

  const onMouseLeave = useCallback(() => {
    hasMouseInteraction.current = false
    maybeScheduleHide()
  }, [maybeScheduleHide])

  const onFocus = useCallback(() => {
    hasKeyboardInteraction.current = true
    clearAutoDismissTimeout()
  }, [clearAutoDismissTimeout])

  const onBlur = useCallback(() => {
    hasKeyboardInteraction.current = false
    maybeScheduleHide()
  }, [maybeScheduleHide])

  return { onMouseEnter, onMouseLeave, onFocus, onBlur }
}
