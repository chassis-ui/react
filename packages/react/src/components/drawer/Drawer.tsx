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

export interface DrawerProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'onCancel' | 'onClose'
> {
  /**
   * Show a backdrop while the drawer is open. `'static'` blocks closing on backdrop click
   * (the drawer nudges instead).
   */
  backdrop?: boolean | 'static'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Size the height to the drawer's content instead of `--drawer-height`. Meaningful for
   * `placement="bottom"`.
   */
  fitContent?: boolean
  /**
   * Expand the panel to fill the viewport, animating in from the direction of `placement`.
   */
  fullscreen?: boolean
  /**
   * Disable the open/close transition entirely.
   */
  instant?: boolean
  /**
   * Closes the drawer when the escape key is pressed.
   */
  keyboard?: boolean
  /**
   * Callback fired when the drawer requests to be closed (escape, backdrop click, close button,
   * or another drawer opening).
   */
  onClose?: () => void
  /**
   * Callback fired when a close attempt is blocked (static backdrop click, or escape with `keyboard=false`).
   */
  onClosePrevented?: () => void
  /**
   * Callback fired after the exit transition completes and the drawer is fully hidden.
   */
  onHidden?: () => void
  /**
   * Callback fired when the drawer starts to open.
   */
  onShow?: () => void
  /**
   * Callback fired after the entry transition completes and the drawer is fully visible.
   */
  onShown?: () => void
  /**
   * Which viewport edge the panel slides in from. Always required — there is no default
   * off-screen transform without one.
   */
  placement: 'start' | 'end' | 'top' | 'bottom'
  /**
   * Renders as a drawer only below this breakpoint — inline as a flex container above it.
   */
  responsive?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * Allow the page behind the drawer to scroll while it's open.
   */
  scroll?: boolean
  /**
   * Remove the inset gap, border radius, and border so the panel sits flush against the
   * viewport edge.
   */
  sheet?: boolean
  /**
   * Apply a frosted-glass background to the panel.
   */
  translucent?: boolean
  /**
   * Toggle the visibility of the drawer component.
   */
  visible?: boolean
}

interface DrawerContextProps {
  requestClose?: () => void
}

export const DrawerContext = createContext<DrawerContextProps>({})

// Currently-open drawers, so opening one can auto-close any other open drawer
// ("When a second drawer opens while one is already open, the first closes automatically").
const openDrawers = new Set<{ dialog: HTMLDialogElement; requestClose: () => void }>()

export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(
  (
    {
      children,
      backdrop = true,
      className,
      fitContent,
      fullscreen,
      instant,
      keyboard = true,
      onClose,
      onClosePrevented,
      onHidden,
      onShow,
      onShown,
      placement,
      responsive,
      scroll = false,
      sheet,
      translucent,
      visible,
      ...rest
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const forkedRef = useForkedRef(ref, dialogRef)

    const [_visible, setVisible] = useState(visible)
    const [staticBounce, setStaticBounce] = useState(false)
    const [scrollLocked, setScrollLocked] = useState(false)
    const openedAsModalRef = useRef(false)
    const triggerRef = useRef<HTMLElement | null>(null)

    // usePreventScroll releases the lock automatically on unmount too, even while still open.
    usePreventScroll({ isDisabled: !scrollLocked })

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const requestClose = () => {
      onClose?.()
    }

    const requestCloseRef = useRef(requestClose)
    requestCloseRef.current = requestClose

    // Register in the cross-instance registry so other drawers can auto-close this one.
    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return undefined
      const entry = { dialog, requestClose: () => requestCloseRef.current() }
      openDrawers.add(entry)
      return () => {
        openDrawers.delete(entry)
      }
    }, [])

    const triggerStaticBounce = () => {
      onClosePrevented?.()
      const dialog = dialogRef.current
      if (!dialog) return
      setStaticBounce(true)
      executeAfterTransition(dialog, () => setStaticBounce(false), !instant)
    }

    useIsomorphicLayoutEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return undefined

      if (_visible) {
        if (dialog.open) return undefined

        for (const entry of openDrawers) {
          if (entry.dialog !== dialog) entry.requestClose()
        }

        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null

        const isModal = Boolean(backdrop) || !scroll
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

        return executeAfterTransition(dialog, () => onShown?.(), !instant)
      }

      if (!dialog.open) return undefined

      // Closing a drawer is safe to do immediately (unlike Modal) — the CSS keeps the
      // element rendered (display: flex) and animates the exit purely via transform /
      // delayed visibility, regardless of the native `open` attribute.
      dialog.close()
      if (openedAsModalRef.current) {
        setScrollLocked(false)
      }

      return executeAfterTransition(
        dialog,
        () => {
          onHidden?.()
          const trigger = triggerRef.current
          if (trigger && document.contains(trigger)) {
            trigger.focus()
          }
        },
        !instant
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_visible])

    // Escape key for non-modal (show()) drawers — the native `cancel` event below only
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
      responsive ? `max-${responsive}:drawer` : 'drawer',
      `drawer-${placement}`,
      {
        fullscreen,
        sheet,
        translucent,
        instant,
        'drawer-fit-content': fitContent,
        nonmodal: !(Boolean(backdrop) || !scroll),
        static: staticBounce
      },
      className
    )

    return (
      <DrawerContext.Provider value={{ requestClose }}>
        <dialog
          {...rest}
          className={_className}
          onCancel={handleCancel}
          onClick={handleBackdropClick}
          ref={forkedRef}
        >
          {children}
        </dialog>
      </DrawerContext.Provider>
    )
  }
)

Drawer.displayName = 'Drawer'
