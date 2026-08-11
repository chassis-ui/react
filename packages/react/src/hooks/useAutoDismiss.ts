import { useCallback, useEffect, useRef } from 'react'

export interface UseAutoDismissOptions {
  /**
   * Enables the auto-dismiss timer. When `false`, `onHide` is never called and the returned
   * handlers are no-ops.
   */
  enabled?: boolean
  /**
   * Delay in ms before `onHide` fires once the timer is (re)started.
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

// Shared timer logic for components that auto-dismiss after a delay, pausing while the pointer
// or focus is on the element (mirrors the behavior `Toast` already implements). Extracted so new
// auto-dismissing components don't reimplement the pause/resume bookkeeping.
export function useAutoDismiss({
  enabled = false,
  delay = 5000,
  visible,
  onHide
}: UseAutoDismissOptions): UseAutoDismissResult {
  const timeout = useRef<number>()
  const hasMouseInteraction = useRef(false)
  const hasKeyboardInteraction = useRef(false)

  const clearAutoDismissTimeout = useCallback(() => {
    clearTimeout(timeout.current)
    timeout.current = undefined
  }, [])

  const maybeScheduleHide = useCallback(() => {
    clearAutoDismissTimeout()
    if (!enabled || hasMouseInteraction.current || hasKeyboardInteraction.current) {
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
