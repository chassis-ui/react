import {
  ForwardedRef,
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

// Shared open/close machinery for a native `<dialog>`-based component — `Modal` and `Drawer`
// otherwise duplicated this near-verbatim: forked ref, the show/begin-hide effect (showModal()
// vs. show(), initial focus, scroll lock), the finish-hide effect (waits out the exit
// transition), the non-modal Escape-key listener (the native `cancel` event only fires for
// dialogs opened with `showModal()`), and the static-backdrop "bounce" used by both the
// backdrop-click handler and the Escape/`cancel` handler. What's left in each caller is only
// what's genuinely component-specific: `Modal`/`Drawer`'s own `_className` building, and
// `Drawer`'s cross-instance "auto-close every other open drawer" registry (wired in via
// `onBeforeShow`, since it needs to run at one precise point inside the show effect).
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
  onBeforeShow,
  onClick,
  onClose,
  onClosePrevented,
  onHidden,
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
  const [hiding, setHiding] = useState(false)
  const [staticBounce, setStaticBounce] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(false)
  const openedAsModalRef = useRef(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Locked from showModal() until the exit transition finishes (see the show/hide effect
  // below) — usePreventScroll releases it automatically on unmount too, even mid-transition.
  usePreventScroll({ isDisabled: !scrollLocked })

  const close = () => {
    onClose?.()
    // Several things can ask an open dialog to close while it is closing; only the first is a
    // change.
    if (_visible) setVisible(false)
  }

  const triggerStaticBounce = () => {
    onClosePrevented?.()
    const dialog = dialogRef.current
    if (!dialog) return
    setStaticBounce(true)
    executeAfterTransition(dialog, () => setStaticBounce(false), !instant)
  }

  // Read through refs, kept current every render, so the keydown listener below — which only
  // resubscribes when `keyboard` changes — never invokes a stale `close`/`triggerStaticBounce`
  // closure if `onClose`/`onClosePrevented`/`instant` change identity without `keyboard` also
  // changing. Same pattern as `Drawer`'s own `closeRef` and `useFloatingOverlay`'s `closeRef`.
  const closeRef = useRef(close)
  closeRef.current = close
  const triggerStaticBounceRef = useRef(triggerStaticBounce)
  triggerStaticBounceRef.current = triggerStaticBounce

  // Show / begin-hide
  useIsomorphicLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    if (_visible) {
      if (dialog.open) return undefined

      onBeforeShow?.(dialog)

      triggerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null

      restoreTargets.set(dialog, triggerRef.current)

      openedAsModalRef.current = isModal
      if (isModal) {
        dialog.showModal()
        setScrollLocked(true)
      } else {
        dialog.show()
      }

      // `data-autofocus` too: React doesn't write the `autofocus` attribute in a client render (it
      // calls `focus()` on mount, which a closed dialog ignores), so `autoFocus` alone only works
      // in server-rendered HTML.
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
        dialog.setAttribute('tabindex', '-1')
        dialog.focus()
      }

      onShow?.()
      setHiding(false)

      return executeAfterTransition(dialog, () => onShown?.(), !instant)
    }

    if (!dialog.open) return undefined
    setHiding(true)
    return undefined
  }, [_visible])

  // Finish hide once the exit transition (or lack thereof) completes
  useEffect(() => {
    const dialog = dialogRef.current
    if (!hiding || !dialog) return undefined

    return executeAfterTransition(
      dialog,
      () => {
        // Focus goes back only if this dialog still has it, or nothing does: another dialog
        // opened from this one (the next alert of a chain) keeps its own. Mirrors `Popover`.
        const active = document.activeElement
        const ownsFocus = !active || active === document.body || dialog.contains(active)
        if (dialog.open) {
          dialog.close()
        }
        if (openedAsModalRef.current) {
          setScrollLocked(false)
        }
        setHiding(false)
        onHidden?.()
        const trigger = ownsFocus ? resolveRestoreTarget(triggerRef.current) : null
        if (trigger && document.contains(trigger)) {
          trigger.focus()
        }
      },
      !instant
    )
  }, [hiding])

  // Escape key for non-modal (show()) dialogs — the native `cancel` event below only
  // fires for dialogs opened with showModal().
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || openedAsModalRef.current) return
      event.preventDefault()
      if (!keyboard) {
        triggerStaticBounceRef.current()
        return
      }
      closeRef.current()
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => dialog.removeEventListener('keydown', handleKeyDown)
  }, [keyboard])

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    if (!keyboard) {
      triggerStaticBounce()
      return
    }
    close()
  }

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    onClick?.(event)
    if (event.target !== dialogRef.current || !openedAsModalRef.current) return
    if (backdrop === 'static') {
      triggerStaticBounce()
      return
    }
    close()
  }

  return { close, dialogRef, forkedRef, handleBackdropClick, handleCancel, hiding, staticBounce }
}
