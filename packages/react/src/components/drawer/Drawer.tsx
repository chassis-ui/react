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

export interface DrawerContextProps {
  /**
   * Requests the drawer be closed — fires `onClose`. Wire this to any element's `onClick`; see
   * `useDrawer`.
   */
  close: () => void
}

export const DrawerContext = createContext<DrawerContextProps>({ close: () => {} })

// Currently-open drawers, so opening one can auto-close any other open drawer
// ("When a second drawer opens while one is already open, the first closes automatically").
const openDrawers = new Set<{ dialog: HTMLDialogElement; close: () => void }>()

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
    const [hiding, setHiding] = useState(false)
    const [staticBounce, setStaticBounce] = useState(false)
    const [scrollLocked, setScrollLocked] = useState(false)
    const openedAsModalRef = useRef(false)
    const triggerRef = useRef<HTMLElement | null>(null)

    // usePreventScroll releases the lock automatically on unmount too, even while still open.
    usePreventScroll({ isDisabled: !scrollLocked })

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const close = () => {
      onClose?.()
    }

    const closeRef = useRef(close)
    closeRef.current = close

    // Register in the cross-instance registry so other drawers can auto-close this one.
    useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return undefined
      const entry = { dialog, close: () => closeRef.current() }
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
          if (entry.dialog !== dialog) entry.close()
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
        setHiding(false)

        return executeAfterTransition(dialog, () => onShown?.(), !instant)
      }

      if (!dialog.open) return undefined
      setHiding(true)
      return undefined
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_visible])

    // Finish hide once the exit transition (or lack thereof) completes. The native `open`
    // attribute — and with it, the `[class*="drawer"]:not([open], .hiding)` escape hatch
    // chassis-css's navbar styles use to suppress the drawer-flash transition when the navbar
    // itself crosses its `expand` breakpoint — has to stay put for the whole transition, or
    // that same rule strips the *intentional* close transition too, the instant `open` is
    // removed. `.hiding` (via `_className` below) is what keeps this close from tripping it.
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

    // Escape key for non-modal (show()) drawers — the native `cancel` event below only
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
      responsive ? `max-${responsive}:drawer` : 'drawer',
      `drawer-${placement}`,
      {
        fullscreen,
        sheet,
        translucent,
        instant,
        'drawer-fit-content': fitContent,
        nonmodal: !(Boolean(backdrop) || !scroll),
        static: staticBounce,
        hiding
      },
      className
    )

    return (
      <DrawerContext.Provider value={{ close }}>
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
