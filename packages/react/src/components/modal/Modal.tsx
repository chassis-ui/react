import React, {
  createContext,
  DialogHTMLAttributes,
  forwardRef,
  useEffect,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import { usePreventScroll } from 'react-aria'

import { useForkedRef, useIsomorphicLayoutEffect } from '../../hooks'
import { executeAfterTransition } from '../../utils/dialogTransition'

export interface ModalProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'onCancel' | 'onClose'
> {
  /**
   * Show a backdrop while the modal is open. `'static'` blocks closing on backdrop click
   * (the modal bounces instead).
   */
  backdrop?: boolean | 'static'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Set modal to cover the entire user viewport. A breakpoint value goes fullscreen only
   * below that breakpoint.
   */
  fullscreen?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * Disable the open/close transition entirely.
   */
  instant?: boolean
  /**
   * Closes the modal when the escape key is pressed.
   */
  keyboard?: boolean
  /**
   * Open with `showModal()` (top-layer, native backdrop). Set `false` to open with `show()`
   * instead — no backdrop, and the page behind the modal stays interactive.
   */
  modal?: boolean
  /**
   * Callback fired when the modal requests to be closed (escape, backdrop click, or close button).
   */
  onClose?: () => void
  /**
   * Callback fired when a close attempt is blocked (static backdrop click, or escape with `keyboard=false`).
   */
  onClosePrevented?: () => void
  /**
   * Callback fired after the exit transition completes and the modal is fully hidden.
   */
  onHidden?: () => void
  /**
   * Callback fired when the modal starts to open.
   */
  onShow?: () => void
  /**
   * Callback fired after the entry transition completes and the modal is fully visible.
   */
  onShown?: () => void
  /**
   * Create a scrollable modal — the header and footer stay fixed while the body scrolls.
   */
  scrollable?: boolean
  /**
   * Size the component small, large, or extra large.
   */
  size?: 'small' | 'large' | 'xlarge'
  /**
   * Toggle the visibility of modal component.
   */
  visible?: boolean
}

export interface ModalContextProps {
  /**
   * Requests the modal be closed — fires `onClose`. Wire this to any element's `onClick`; see
   * `useModal`.
   */
  close: () => void
}

export const ModalContext = createContext<ModalContextProps>({ close: () => {} })

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      children,
      backdrop = true,
      className,
      fullscreen,
      instant,
      keyboard = true,
      modal = true,
      onClose,
      onClosePrevented,
      onHidden,
      onShow,
      onShown,
      scrollable,
      size,
      visible,
      ...rest
    },
    ref
  ) => {
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

    // Show / begin-hide
    useIsomorphicLayoutEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return

      if (_visible) {
        if (dialog.open) return undefined

        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null

        openedAsModalRef.current = modal
        if (modal) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hiding])

    // Escape key for non-modal (show()) dialogs — the native `cancel` event below only
    // fires for dialogs opened with showModal().
    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return undefined

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || openedAsModalRef.current) return
        event.preventDefault()
        if (!keyboard) return
        close()
      }

      dialog.addEventListener('keydown', handleKeyDown)
      return () => dialog.removeEventListener('keydown', handleKeyDown)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyboard])

    const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault()
      if (!keyboard) {
        triggerStaticBounce()
        return
      }
      close()
    }

    const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target !== dialogRef.current || !openedAsModalRef.current) return
      if (backdrop === 'static') {
        triggerStaticBounce()
        return
      }
      close()
    }

    const _className = classNames(
      'modal',
      'dialog',
      {
        [typeof fullscreen === 'boolean' ? 'fullscreen' : `max-${fullscreen}:fullscreen`]:
          fullscreen,
        [`${size}`]: size,
        instant,
        nonmodal: !modal,
        scrollable,
        hiding,
        'dialog-static': staticBounce
      },
      className
    )

    return (
      <ModalContext.Provider value={{ close }}>
        <dialog
          {...rest}
          className={_className}
          onCancel={handleCancel}
          onClick={handleBackdropClick}
          ref={forkedRef}
        >
          {children}
        </dialog>
      </ModalContext.Provider>
    )
  }
)

Modal.displayName = 'Modal'
