import React, {
  createContext,
  DialogHTMLAttributes,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../utils/hooks'

export interface CModalProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'onCancel' | 'onClose'> {
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

interface ModalContextProps {
  requestClose?: () => void
}

export const CModalContext = createContext<ModalContextProps>({})

// Dialogs opened as top-layer modals, tracked so the body-scroll lock is only
// released once every open modal dialog has closed.
const openModalDialogs = new Set<HTMLDialogElement>()

const getTransitionDuration = (element: HTMLElement) => {
  const { transitionDuration, transitionDelay } = window.getComputedStyle(element)
  const duration = Number.parseFloat(transitionDuration) || 0
  const delay = Number.parseFloat(transitionDelay) || 0
  if (!duration && !delay) return 0
  return (duration + delay) * 1000
}

const executeAfterTransition = (element: HTMLElement, callback: () => void, animated: boolean) => {
  if (!animated) {
    callback()
    return () => undefined
  }

  let called = false
  const done = () => {
    if (called) return
    called = true
    element.removeEventListener('transitionend', handleEnd)
    clearTimeout(timer)
    callback()
  }
  const handleEnd = (event: Event) => {
    if (event.target === element) done()
  }
  element.addEventListener('transitionend', handleEnd)
  const timer = setTimeout(done, getTransitionDuration(element) + 50)
  return () => {
    element.removeEventListener('transitionend', handleEnd)
    clearTimeout(timer)
  }
}

export const CxModal = forwardRef<HTMLDialogElement, CModalProps>(
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
    ref,
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const forkedRef = useForkedRef(ref, dialogRef)

    const [_visible, setVisible] = useState(visible)
    const [hiding, setHiding] = useState(false)
    const [staticBounce, setStaticBounce] = useState(false)
    const openedAsModalRef = useRef(false)

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    // Release the body-scroll lock if the component unmounts while still open
    // (e.g. a parent stops rendering it without waiting for a close transition).
    useEffect(() => {
      const dialog = dialogRef.current
      return () => {
        if (dialog && openModalDialogs.delete(dialog) && openModalDialogs.size === 0) {
          document.body.classList.remove('dialog-open')
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const requestClose = () => {
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
    useLayoutEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return

      if (_visible) {
        if (dialog.open) return undefined

        openedAsModalRef.current = modal
        if (modal) {
          dialog.showModal()
          openModalDialogs.add(dialog)
          document.body.classList.add('dialog-open')
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
            openModalDialogs.delete(dialog)
            if (openModalDialogs.size === 0) {
              document.body.classList.remove('dialog-open')
            }
          }
          setHiding(false)
          onHidden?.()
        },
        !instant,
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
        requestClose()
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
      requestClose()
    }

    const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target !== dialogRef.current || !openedAsModalRef.current) return
      if (backdrop === 'static') {
        triggerStaticBounce()
        return
      }
      requestClose()
    }

    const _className = classNames(
      'modal',
      'dialog',
      {
        [typeof fullscreen === 'boolean' ? 'fullscreen' : `max-${fullscreen}:fullscreen`]: fullscreen,
        [`${size}`]: size,
        instant,
        nonmodal: !modal,
        scrollable,
        hiding,
        'dialog-static': staticBounce,
      },
      className,
    )

    return (
      <CModalContext.Provider value={{ requestClose }}>
        <dialog
          {...rest}
          className={_className}
          onCancel={handleCancel}
          onClick={handleBackdropClick}
          ref={forkedRef}
        >
          {children}
        </dialog>
      </CModalContext.Provider>
    )
  },
)

CxModal.displayName = 'CxModal'
