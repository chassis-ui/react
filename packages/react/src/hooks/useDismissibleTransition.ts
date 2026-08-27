import { ForwardedRef, RefObject, useCallback, useEffect, useId, useRef, useState } from 'react'

import { useForkedRef } from './useForkedRef'

export interface UseDismissibleTransitionOptions {
  /**
   * Callback fired once the exit transition completes and the component is fully hidden.
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

export interface UseDismissibleTransitionTransitionProps {
  appear: true
  in: boolean
  nodeRef: RefObject<HTMLDivElement | null>
  onEnter: () => void
  onEntered: () => void
  onExit: () => void
  onExited: () => void
  unmountOnExit: true
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
  getTransitionClass: (state: string) => string | undefined
  textId: string
  titleId: string
  /**
   * Spread directly onto `<Transition>`. Each caller still supplies its own `timeout` (and any
   * extra props, e.g. `mountOnEnter`) on top of this.
   */
  transitionProps: UseDismissibleTransitionTransitionProps
  /**
   * The internal, transition-driving visible state — distinct from the `visible` prop, since a
   * `close()` call (or the exit transition itself) needs to flip this independently of whatever
   * the caller is currently passing in.
   */
  visible: boolean
}

// Shared dismiss/transition machinery for `Toast` and `Notification` — both otherwise duplicated
// this near-verbatim: visible-state + prop-sync effect, a forked ref, `getTransitionClass`,
// `titleId`/`textId` via `useId()`, and the `Transition` entry/exit callback wiring.
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
export function useDismissibleTransition({
  onClose,
  onShow,
  ref,
  visible = false
}: UseDismissibleTransitionOptions): UseDismissibleTransitionResult {
  const [_visible, setVisible] = useState(visible)
  const [entered, setEntered] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const forkedRef = useForkedRef(ref, nodeRef)
  const titleId = useId()
  const textId = useId()

  useEffect(() => {
    setVisible(visible)
  }, [visible])

  const close = useCallback(() => setVisible(false), [])

  const getTransitionClass = (state: string) =>
    state === 'entering' || state === 'exiting'
      ? 'show showing'
      : state === 'entered'
        ? 'show'
        : undefined

  return {
    close,
    entered,
    forkedRef,
    getTransitionClass,
    textId,
    titleId,
    transitionProps: {
      appear: true,
      in: _visible,
      nodeRef,
      onEnter: () => onShow?.(),
      onEntered: () => setEntered(true),
      onExit: () => setEntered(false),
      onExited: () => onClose?.(),
      unmountOnExit: true
    },
    visible: _visible
  }
}
