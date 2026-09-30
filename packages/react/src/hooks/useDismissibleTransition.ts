import { ForwardedRef, useCallback, useEffect, useId, useRef } from 'react'

import { useHydrated } from '../components/portal/Portal'
import { warnDroppedVisibleRequest } from '../utils/visibleState'
import { useControllableState } from './useControllableState'
import { useForkedRef } from './useForkedRef'
import { useTransitionState } from './useTransitionState'

export interface UseDismissibleTransitionOptions {
  /**
   * Initial state of an uncontrolled component. `Toast` starts hidden, `Notification` shown.
   */
  defaultVisible: boolean
  /**
   * The component's name, for the development warning about a dropped close request.
   */
  displayName: string
  /**
   * Callback fired once the exit transition completes and the component is fully hidden, or
   * when the component unmounts before its exit could complete.
   */
  onClose?: () => void
  /**
   * Callback fired when the component starts to show.
   */
  onShow?: () => void
  /**
   * Callback fired with `false` when the component asks to hide: its close button, `close()`
   * from its context, or the autohide timer.
   */
  onVisibleChange?: (visible: boolean) => void
  ref: ForwardedRef<HTMLDivElement>
  /**
   * Controlled state; `undefined` means uncontrolled.
   */
  visible?: boolean
}

export interface UseDismissibleTransitionResult {
  /**
   * Requests the component be closed. Uncontrolled, that hides it: the exit transition starts
   * and `onClose` fires once it finishes. Controlled by `visible`, it only reports to
   * `onVisibleChange`. Stable across re-renders (see the hook's own doc comment for why that
   * matters).
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
   * The state that drives the transition: the `visible` prop when it is set, the component's own
   * state otherwise.
   */
  visible: boolean
}

// Shared dismiss/transition machinery for `Toast` and `Notification` — both otherwise duplicated
// this near-verbatim: visible-state + prop-sync effect, a forked ref, the phase-to-class mapping,
// `titleId`/`textId` via `useId()`, and the enter/exit callback wiring of `useTransitionState`.
//
// `close` is memoized once here with `useCallback` (empty deps — it reads everything it needs
// through refs) specifically so it has a stable identity across re-renders. Previously each component built its own unmemoized
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
// same commit as the state change `close()` asked for. That holds for an uncontrolled component,
// where `close()` is the change. A controlled one owes `onClose` only once `visible` has become
// `false` and the exit has started: until then `close()` is a request its owner may decline.
export function useDismissibleTransition({
  defaultVisible,
  displayName,
  onClose,
  onShow,
  onVisibleChange,
  ref,
  visible
}: UseDismissibleTransitionOptions): UseDismissibleTransitionResult {
  const isControlled = visible !== undefined
  const [_visible, setVisible] = useControllableState(visible, defaultVisible, onVisibleChange)
  const nodeRef = useRef<HTMLDivElement>(null)
  const forkedRef = useForkedRef(ref, nodeRef)
  const titleId = useId()
  const textId = useId()

  const closeOwedRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const reportClose = useCallback(() => {
    if (!closeOwedRef.current) return
    closeOwedRef.current = false
    onCloseRef.current?.()
  }, [])

  // Replaced every render, so the stable `close` below always reports to the current props.
  const requestHideRef = useRef(() => {})
  requestHideRef.current = () => {
    // Closing what is already hidden asks for nothing, so it owes no `onClose`.
    if (!_visible) return
    if (!isControlled) closeOwedRef.current = true
    warnDroppedVisibleRequest({ onVisibleChange, visible }, false, displayName)
    setVisible(false)
  }

  const close = useCallback(() => requestHideRef.current(), [])

  // A component mounted visible plays its enter transition, except in the server's HTML and
  // while hydrating it: there is nothing on screen to animate from, and starting hidden left the
  // page without the component until the JavaScript had loaded. It starts settled, with `show`.
  const hydrated = useHydrated()

  const { isMounted, phase } = useTransitionState({
    appear: hydrated,
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

  // Settled from the start, the component never enters, which is where `onShow` fires: fire it
  // once on mount instead, since it did show. The ref keeps StrictMode's second run from firing
  // it again.
  const showOwedRef = useRef(!hydrated && _visible)
  useEffect(() => {
    if (!showOwedRef.current) return
    showOwedRef.current = false
    onShow?.()
  }, [])

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
