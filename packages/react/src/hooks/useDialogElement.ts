import {
  ForwardedRef,
  MouseEvent as ReactMouseEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { usePreventScroll } from 'react-aria'

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
  onClose?: () => void
  onClosePrevented?: () => void
  onHidden?: () => void
  onShow?: () => void
  onShown?: () => void
  ref: ForwardedRef<HTMLDialogElement>
  visible?: boolean
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
export const useDialogElement = ({
  backdrop,
  instant,
  isModal,
  keyboard = true,
  onBeforeShow,
  onClose,
  onClosePrevented,
  onHidden,
  onShow,
  onShown,
  ref,
  visible
}: UseDialogElementOptions) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const forkedRef = useForkedRef(ref, dialogRef)

  const [_visible, setVisible] = useState(visible)
  const [hiding, setHiding] = useState(false)
  const [staticBounce, setStaticBounce] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(false)
  const openedAsModalRef = useRef(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Locked from showModal() until the exit transition finishes (see the show/hide effect
  // below) — usePreventScroll releases it automatically on unmount too, even mid-transition.
  usePreventScroll({ isDisabled: !scrollLocked })

  useEffect(() => {
    setVisible(visible)
  }, [visible])

  const close = () => {
    onClose?.()
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

      openedAsModalRef.current = isModal
      if (isModal) {
        dialog.showModal()
        setScrollLocked(true)
      } else {
        dialog.show()
      }

      const autofocusEl = dialog.querySelector<HTMLElement>('[autofocus]')
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
        if (dialog.open) {
          dialog.close()
        }
        if (openedAsModalRef.current) {
          setScrollLocked(false)
        }
        setHiding(false)
        onHidden?.()
        const trigger = triggerRef.current
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
    if (event.target !== dialogRef.current || !openedAsModalRef.current) return
    if (backdrop === 'static') {
      triggerStaticBounce()
      return
    }
    close()
  }

  return { close, dialogRef, forkedRef, handleBackdropClick, handleCancel, hiding, staticBounce }
}
