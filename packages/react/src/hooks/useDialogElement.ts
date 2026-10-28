import {
  ForwardedRef,
  KeyboardEvent as ReactKeyboardEvent,
  KeyboardEventHandler,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { usePreventScroll } from 'react-aria'

import { useControllableState } from './useControllableState'
import { useForkedRef } from './useForkedRef'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { executeAfterTransition } from '../utils/dialogTransition'
import { hasOverlayWithin, pushOverlay } from '../utils/overlayStack'

export interface UseDialogElementOptions {
  /**
   * Same-named prop from the caller (`Modal`/`Drawer`) — only ever consulted here to
   * distinguish `'static'` from everything else for the backdrop-click/Escape bounce.
   */
  backdrop?: boolean | 'static'
  /**
   * Initial open state of an uncontrolled dialog.
   */
  defaultVisible?: boolean
  /**
   * Disables the open/close transition entirely.
   */
  instant?: boolean
  /**
   * Whether this open should use `showModal()` (top-layer, native backdrop, scroll-locked) or
   * `show()` — `Modal` passes its own `modal` prop straight through; `Drawer` derives it from
   * `backdrop`/`scroll` instead, since its vanilla chassis-css counterpart does the same.
   */
  isModal: boolean
  /**
   * Whether a modal open locks the page's scroll, for as long as the dialog is open. Defaults to
   * `isModal`. `Drawer` passes `!scroll`: its `scroll` lets the page scroll behind a drawer that is
   * still modal for its backdrop.
   */
  lockScroll?: boolean
  /**
   * Closes on the escape key / native `cancel` event.
   */
  keyboard?: boolean
  /**
   * Fires synchronously right before a closed dialog actually opens (after the "already open"
   * bail-out, before capturing the pre-open trigger element) — `Drawer`'s only hook into the
   * show effect, used to auto-close every other open drawer first.
   */
  onBeforeShow?: (dialog: HTMLDialogElement) => void
  /**
   * The caller's own `onClick`, chained ahead of the backdrop-click handling below rather than
   * left in the props spread — a `<dialog>` needs `onClick` for its own backdrop detection, so
   * spreading the caller's alongside it silently dropped one of the two. Fires for every click
   * on the dialog, not just backdrop ones.
   */
  onClick?: MouseEventHandler<HTMLDialogElement>
  onClose?: () => void
  onClosePrevented?: () => void
  onHidden?: () => void
  /**
   * The caller's own `onKeyDown`, chained ahead of the Escape handling of a non-modal dialog, for
   * the reason `onClick` is.
   */
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>
  onShow?: () => void
  onShown?: () => void
  /**
   * Fired with `false` for each close request, beside `onClose`.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * The native `open` attribute the caller renders. Without `visible` or `defaultVisible`, it is
   * the initial state: the dialog is rendered open (non-modal) from the first paint, server HTML
   * included, and stays open until a close request, instead of being closed on mount.
   */
  open?: boolean
  ref: ForwardedRef<HTMLDialogElement>
  /**
   * Controlled open state; `undefined` means uncontrolled.
   */
  visible?: boolean
}

// Where a dialog is in its show/hide cycle. The native dialog is open in every phase but
// `closed`: it stays in the top layer for as long as its exit lasts.
type DialogPhase = 'closed' | 'opening' | 'open' | 'closing'

// The element each open dialog returns focus to when it closes.
const restoreTargets = new WeakMap<HTMLDialogElement, HTMLElement | null>()

// The element a closing dialog returns focus to. A dialog opened from another dialog that has
// closed since (the second alert of a chain) can't return focus to its trigger, which is hidden,
// so it follows that dialog's own target, and so on. A loop (going back and forth between two
// dialogs) gives up.
function resolveRestoreTarget(trigger: HTMLElement | null): HTMLElement | null {
  const seen = new Set<HTMLDialogElement>()
  let target = trigger
  let owner = target?.closest('dialog') ?? null
  while (target && owner && !owner.open) {
    if (seen.has(owner)) return null
    seen.add(owner)
    target = restoreTargets.get(owner) ?? null
    owner = target?.closest('dialog') ?? null
  }
  return target
}

// Shared open/close machinery for a native `<dialog>`-based component — `Modal`, `Alert` and
// `Drawer` otherwise duplicated this near-verbatim: forked ref, the show/begin-hide effect
// (showModal() vs. show(), initial focus, scroll lock), the effect that waits out the enter and
// exit transitions, the non-modal Escape-key handler (the native `cancel` event only fires for
// dialogs opened with `showModal()`), the native `close` event, and the static-backdrop "bounce"
// used by both the backdrop-click handler and the Escape/`cancel` handler. What's left in each
// caller is only what's genuinely component-specific: `Modal`/`Drawer`'s own `_className`
// building, and `Drawer`'s cross-instance "auto-close every other open drawer" registry (wired in
// via `onBeforeShow`, since it needs to run at one precise point inside the show effect).
//
// A dialog has no trigger of its own, so the only change it asks for is a close: Escape, a
// backdrop click, a close button. That request fires `onClose` and `onVisibleChange(false)`.
// Controlled by `visible`, the dialog stays open until the caller sets it to `false`; with
// `defaultVisible` it closes itself.
export const useDialogElement = ({
  backdrop,
  defaultVisible,
  instant,
  isModal,
  keyboard = true,
  lockScroll = isModal,
  onBeforeShow,
  onClick,
  onClose,
  onClosePrevented,
  onHidden,
  onKeyDown,
  onShow,
  onShown,
  onVisibleChange,
  open,
  ref,
  visible
}: UseDialogElementOptions) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const forkedRef = useForkedRef(ref, dialogRef)

  const [_visible, setVisible] = useControllableState(
    visible,
    defaultVisible ?? open ?? false,
    onVisibleChange
  )
  // A dialog rendered with the native `open` attribute is open before any effect has run.
  const [phase, setPhaseState] = useState<DialogPhase>(open ? 'open' : 'closed')
  // Mirrors `phase` at the moment it is set, not at the next render, as `useTransitionState`
  // does: StrictMode runs the show effect twice on mount, and the second run has to see that the
  // first has shown the dialog. It is also what tells a reopening during the exit from a first
  // opening, and the browser's `close` event from the one that follows our own `close()` when
  // nothing has reopened the dialog since (`handleNativeClose`).
  const phaseRef = useRef(phase)
  const setPhase = (next: DialogPhase) => {
    phaseRef.current = next
    setPhaseState(next)
  }
  const [staticBounce, setStaticBounce] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(false)
  const openedAsModalRef = useRef(false)
  const lockedScrollRef = useRef(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Locked from showModal() until the exit transition finishes (see the show/hide effect
  // below) — usePreventScroll releases it automatically on unmount too, even mid-transition.
  usePreventScroll({ isDisabled: !scrollLocked })

  // Several things can ask an open dialog to close while it is closing; only the first is a
  // request, for `onClose` as for `onVisibleChange`.
  const close = () => {
    if (!_visible) return
    onClose?.()
    setVisible(false)
  }

  const triggerStaticBounce = () => {
    onClosePrevented?.()
    const dialog = dialogRef.current
    if (!dialog) return
    setStaticBounce(true)
    executeAfterTransition(dialog, () => setStaticBounce(false), !instant)
  }

  // Read through a ref, kept current every render, so a transition that ends renders later
  // calls the callbacks of that moment, and a caller can pass them inline.
  const callbacks = { onBeforeShow, onHidden, onShow, onShown }
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const finishHide = (dialog: HTMLDialogElement) => {
    // Focus goes back only if this dialog still has it, or nothing does: another dialog
    // opened from this one (the next alert of a chain) keeps its own. Mirrors `Popover`.
    const active = document.activeElement
    const ownsFocus = !active || active === document.body || dialog.contains(active)
    // Settled before `close()`, so the native `close` event it fires isn't taken for the
    // browser's (`handleNativeClose`).
    setPhase('closed')
    if (dialog.open) {
      dialog.close()
    }
    if (lockedScrollRef.current) {
      lockedScrollRef.current = false
      setScrollLocked(false)
    }
    callbacksRef.current.onHidden?.()
    const trigger = ownsFocus ? resolveRestoreTarget(triggerRef.current) : null
    if (trigger && document.contains(trigger)) {
      trigger.focus()
    }
  }

  // Show / begin-hide
  useIsomorphicLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const current = phaseRef.current
    const isShown = current === 'opening' || current === 'open'
    if (_visible === isShown) return

    if (_visible) {
      callbacksRef.current.onBeforeShow?.(dialog)

      // Reopened while its exit runs, the dialog is still open: it stays as it is, with the
      // trigger and the scroll lock of its first opening, and leaving the `closing` phase drops
      // the wait that would have closed it.
      if (!dialog.open) {
        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null

        restoreTargets.set(dialog, triggerRef.current)

        openedAsModalRef.current = isModal
        lockedScrollRef.current = isModal && lockScroll
        if (isModal) {
          dialog.showModal()
        } else {
          dialog.show()
        }
        if (lockedScrollRef.current) setScrollLocked(true)

        // `data-autofocus` too: React doesn't write the `autofocus` attribute in a client render
        // (it calls `focus()` on mount, which a closed dialog ignores), so `autoFocus` alone only
        // works in server-rendered HTML.
        // Only this dialog's own: one inside a nested dialog (an `Alert` in a `Modal`) is hidden
        // while that dialog is closed, and focusing it would fail silently.
        const autofocusEl = [
          ...dialog.querySelectorAll<HTMLElement>(
            '[autofocus], [data-autofocus]:not([data-autofocus="false"])'
          )
        ].find((element) => element.closest('dialog') === dialog)
        if (autofocusEl) {
          autofocusEl.focus()
        } else {
          // Focusable through the `tabIndex={-1}` each dialog renders.
          dialog.focus()
        }
      }

      callbacksRef.current.onShow?.()
      setPhase('opening')
      return
    }

    // Closed by the browser already, with its `close` event still to come.
    if (!dialog.open) {
      finishHide(dialog)
      return
    }
    setPhase('closing')
  }, [_visible])

  // Finish the show or the hide once the transition (or lack thereof) completes. A phase that is
  // left before that drops its wait: a dialog closed while it opens never reports `onShown`, and
  // one reopened while it closes is never closed.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    if (phase === 'opening') {
      return executeAfterTransition(
        dialog,
        () => {
          setPhase('open')
          callbacksRef.current.onShown?.()
        },
        !instant
      )
    }
    if (phase === 'closing') {
      return executeAfterTransition(dialog, () => finishHide(dialog), !instant)
    }
    return undefined
  }, [phase])

  // Unmounted while open (`{open && <Modal visible>}`), the dialog never reaches `finishHide`, so
  // focus it held fell to `<body>` with it. Focus goes back to the trigger here instead, under the
  // same condition. Whether the dialog held focus is read in the layout cleanup, before React
  // takes the element out; the focus waits for a microtask, by which time the dialog has left the
  // top layer and the trigger is no longer inert. StrictMode's simulated unmount runs this cleanup
  // too, and mounts again within the same task: `mountedRef` tells the two apart.
  const mountedRef = useRef(false)
  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      const dialog = dialogRef.current
      const active = document.activeElement
      if (!dialog || phaseRef.current === 'closed' || !active || !dialog.contains(active)) return
      const trigger = triggerRef.current
      queueMicrotask(() => {
        if (mountedRef.current) return
        const current = document.activeElement
        if (current && current !== document.body) return
        const target = resolveRestoreTarget(trigger)
        if (target && document.contains(target)) target.focus()
      })
    }
  }, [])

  // A modal dialog holds a place among the open overlays for as long as it is open, so Escape
  // doesn't reach a popover or a menu left open under it (`overlayStack`).
  const isOpen = phase !== 'closed'
  useEffect(() => {
    if (!isOpen || !openedAsModalRef.current) return undefined
    return pushOverlay({ nodes: () => [dialogRef.current] })
  }, [isOpen])

  // Where the last press on the open dialog started, for `handleBackdropClick`. A press that goes
  // down on the content and comes up on the backdrop (a drag out of a text field, a crop handle
  // pulled past the edge) gets its `click` on the nearest common ancestor of the two, the
  // `<dialog>` itself, which is not a click on the backdrop. `pointerdown` as well as `mousedown`:
  // a pointer press whose `pointerdown` is prevented sends no `mousedown`. Native and in the
  // capture phase, so nothing inside the dialog can stop it, and no caller's handler of the same
  // name is replaced.
  const pressTargetRef = useRef<EventTarget | null>(null)
  useEffect(() => {
    const dialog = isOpen ? dialogRef.current : null
    if (!dialog) return undefined
    const handlePress = (event: Event) => {
      pressTargetRef.current = event.target
    }
    dialog.addEventListener('pointerdown', handlePress, true)
    dialog.addEventListener('mousedown', handlePress, true)
    return () => {
      pressTargetRef.current = null
      dialog.removeEventListener('pointerdown', handlePress, true)
      dialog.removeEventListener('mousedown', handlePress, true)
    }
  }, [isOpen])

  // The native `close` event. After our own `close()` the phase is settled and there is nothing
  // left to do. Otherwise the browser closed the dialog by itself: a `<form method="dialog">`, a
  // caller's own `close()`, or a close request it doesn't let a page cancel. The state follows: a
  // close request, the scroll lock released, `onHidden`. A caller that holds `visible` through
  // that request has a closed dialog until `visible` changes.
  //
  // A browser fires `close` from a task it queues, not inside `close()`. A dialog shown again
  // before that task runs (the next step of a wizard opened from `onHidden`, `visible` set to
  // `false` and back in one event) is open when the event arrives, and in a phase other than
  // `closed`: the close it reports is one the reopening has undone, and it is left alone.
  const handleNativeClose = () => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open || phaseRef.current === 'closed') return
    close()
    finishHide(dialog)
  }

  // A dialog open inside another (an `Alert` in a `Modal`'s body, a `Modal` in a `Drawer`) closes
  // with it, as a popover or a tooltip in it does (`useFloatingOverlay`). Left open, it stayed in
  // the top layer under an ancestor no longer displayed: invisible, with the scroll lock it holds,
  // and, opened with `showModal()`, the rest of the page inert. Its close is the browser closing
  // it: a close request, then the hide at once, since the ancestor it shows in is gone. The
  // ancestor's `close` event is ignored, as this dialog's own is, when the ancestor is open
  // again by the time it arrives.
  const closeWithAncestorRef = useRef(() => {})
  closeWithAncestorRef.current = () => {
    const dialog = dialogRef.current
    if (!dialog || phaseRef.current === 'closed') return
    close()
    finishHide(dialog)
  }
  useEffect(() => {
    const ancestor = isOpen ? dialogRef.current?.parentElement?.closest('dialog') : null
    if (!ancestor) return undefined
    const handleAncestorClose = () => {
      if (!ancestor.open) closeWithAncestorRef.current()
    }
    ancestor.addEventListener('close', handleAncestorClose)
    return () => ancestor.removeEventListener('close', handleAncestorClose)
  }, [isOpen])

  // Escape key for non-modal (show()) dialogs — the native `cancel` event below only fires for
  // dialogs opened with showModal(). A React handler, so an Escape that something inside the
  // dialog has handled and stopped never arrives, wherever that thing is portaled. One it has
  // only prevented, or that an overlay open inside this dialog is about to take on `window`
  // (`overlayStack`), is left alone too: Escape closes the innermost overlay only.
  // A modal dialog that keeps Escape out (`keyboard={false}`) prevents the key too: Chromium
  // honours `cancel`'s `preventDefault()` once per user activation, and a second Escape in a row
  // closed the dialog anyway. A prevented keydown sends no `cancel` at all, so the bounce is
  // started here.
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    onKeyDown?.(event)
    if (event.key !== 'Escape' || event.defaultPrevented) return
    if (openedAsModalRef.current && keyboard) return
    const dialog = dialogRef.current
    if (dialog && hasOverlayWithin(dialog)) return
    event.preventDefault()
    if (!keyboard) {
      triggerStaticBounce()
      return
    }
    close()
  }

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    if (!keyboard) {
      triggerStaticBounce()
      return
    }
    close()
  }

  // A click on the `<dialog>` is one on the backdrop only when its press started there too. A
  // click with no press before it (`element.click()`, an assistive technology) still counts.
  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    onClick?.(event)
    const pressTarget = pressTargetRef.current
    pressTargetRef.current = null
    const dialog = dialogRef.current
    if (event.target !== dialog || !openedAsModalRef.current) return
    if (pressTarget !== null && pressTarget !== dialog) return
    if (backdrop === 'static') {
      triggerStaticBounce()
      return
    }
    close()
  }

  return {
    close,
    dialogRef,
    forkedRef,
    handleBackdropClick,
    handleCancel,
    handleKeyDown,
    handleNativeClose,
    hiding: phase === 'closing',
    staticBounce
  }
}
