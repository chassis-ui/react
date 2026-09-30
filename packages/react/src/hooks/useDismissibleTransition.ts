import { ForwardedRef, useCallback, useEffect, useId, useRef, useState } from 'react'

import { useForkedRef } from './useForkedRef'
import { useTransitionState } from './useTransitionState'

export interface UseDismissibleTransitionOptions {
  /**
   * Callback fired once the exit transition completes and the component is fully hidden, or
   * when the component unmounts before its exit could complete.
   */
  onClose?: () => void
  /**
   * Callback fired when the component starts to show.
   */
  onShow?: () => void
  ref: ForwardedRef<HTMLDivElement>
  /**
   * Toggle the visibility of the component.
   */
  visible?: boolean
}

export interface UseDismissibleTransitionResult {
  /**
   * Requests the component be closed — sets the internal visible state to `false`, which kicks
   * off the exit transition; `onClose` fires once it finishes. Stable across re-renders (see the
   * hook's own doc comment for why that matters).
   */
  close: () => void
  /**
   * Whether the entrance transition has actually finished — `false` while still fading/sliding
   * in, even though `visible` is already `true`. Gate anything that should only start once the
   * component is fully, visibly present (e.g. an autohide timer) on this rather than `visible`
   * alone.
   */
  entered: boolean
  forkedRef: ReturnType<typeof useForkedRef<HTMLDivElement>>
  /**
   * `false` before the component first shows and after it has exited: render nothing.
   */
  isMounted: boolean
  textId: string
  titleId: string
  /**
   * chassis-css's classes for the current phase: `show showing` while entering or exiting,
   * `show` once settled, none while hidden.
   */
  transitionClass: string | undefined
  /**
   * The internal, transition-driving visible state — distinct from the `visible` prop, since a
   * `close()` call (or the exit transition itself) needs to flip this independently of whatever
   * the caller is currently passing in.
   */
  visible: boolean
}

// Shared dismiss/transition machinery for `Toast` and `Notification` — both otherwise duplicated
// this near-verbatim: visible-state + prop-sync effect, a forked ref, the phase-to-class mapping,
// `titleId`/`textId` via `useId()`, and the enter/exit callback wiring of `useTransitionState`.
//
// `close` is memoized once here with `useCallback` (empty deps — it only ever calls
// `setVisible(false)`, whose setter identity is itself stable) specifically so it has a stable
// identity across re-renders. Previously each component built its own unmemoized
// `() => setVisible(false)` inline and passed it straight into `useAutoDismiss`, whose scheduling
// effect depends on that closure's identity — since `Toaster`/`NotificationStack` re-render every
// mounted item whenever the shared queue changes (`ToastQueue.add()`/`.close()` notify all
// subscribers synchronously), that meant adding or dismissing any one toast/notification silently
// restarted every other visible one's autohide countdown, with no code change needed to trigger
// it beyond normal multi-item usage.
//
// `entered` similarly gates "has the entrance transition actually finished" uniformly for both —
// `Toast` already had this (gating on `visible` alone would start the autohide timer the instant
// `visible` flips true, while still fading/sliding in); `Notification` didn't, so this extraction
// gives it the same fix for free.
//
// `onClose` normally fires when the exit transition has finished. A component that unmounts
// before that (a `Toaster` remounted by a navigation 50 ms after its toast's action was clicked,
// issue #40) would never report the close it was asked for, and a queued toast would come back
// with the next `Toaster`. So an unmount with a close still owed reports it then. It is owed from
// the `close()` call itself, not from the start of the exit, because the unmount can land in the
// same commit as the state change `close()` asked for.
export function useDismissibleTransition({
  onClose,
  onShow,
  ref,
  visible = false
}: UseDismissibleTransitionOptions): UseDismissibleTransitionResult {
  const [_visible, setVisible] = useState(visible)
  const nodeRef = useRef<HTMLDivElement>(null)
  const forkedRef = useForkedRef(ref, nodeRef)
  const titleId = useId()
  const textId = useId()

  const closeOwedRef = useRef(false)
  const visibleRef = useRef(_visible)
  visibleRef.current = _visible
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const reportClose = useCallback(() => {
    if (!closeOwedRef.current) return
    closeOwedRef.current = false
    onCloseRef.current?.()
  }, [])

  useEffect(() => {
    setVisible(visible)
  }, [visible])

  const close = useCallback(() => {
    // Closing what is already hidden asks for nothing, so it owes no `onClose`.
    if (visibleRef.current) closeOwedRef.current = true
    setVisible(false)
  }, [])

  const { isMounted, phase } = useTransitionState({
    appear: true,
    in: _visible,
    nodeRef,
    onEnter: () => {
      closeOwedRef.current = false
      onShow?.()
    },
    onExit: () => {
      closeOwedRef.current = true
    },
    onExited: reportClose,
    unmountOnExit: true
  })

  useEffect(() => reportClose, [reportClose])

  return {
    close,
    entered: phase === 'entered',
    forkedRef,
    isMounted,
    textId,
    titleId,
    transitionClass:
      phase === 'entering' || phase === 'exiting'
        ? 'show showing'
        : phase === 'entered'
          ? 'show'
          : undefined,
    visible: _visible
  }
}
