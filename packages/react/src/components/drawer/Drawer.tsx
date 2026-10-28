import React, { DialogHTMLAttributes, forwardRef, useEffect, useId, useRef } from 'react'
import classNames from 'classnames'

import { useDialogElement, useIsomorphicLayoutEffect } from '../../hooks'
import { useDialogTitle } from '../../hooks/useDialogTitle'
import { findDialogTitleId } from '../../utils/dialogTitle'
import { DrawerContext, DrawerTitleContext } from './context'
import { DrawerTitle } from './DrawerTitle'

export interface DrawerProps extends Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'onCancel' | 'onClose'
> {
  /**
   * Show a backdrop while the drawer is open. `'static'` blocks closing on backdrop click
   * (the drawer nudges instead). `false` takes effect only together with `scroll`: the drawer
   * then opens non-modal, with no backdrop and the page usable behind it. Without `scroll` the
   * drawer stays modal, backdrop and all, as chassis-css's vanilla drawer derives it.
   */
  backdrop?: boolean | 'static'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Whether the drawer is open when it first renders. Such a drawer is uncontrolled: it closes
   * itself on a close request. Use `visible` to open and close it from outside.
   */
  defaultVisible?: boolean
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
   * Renders the drawer open from its first paint, server HTML included, as a non-modal dialog: a
   * static preview. It stays open until a close request. Use `visible` or `defaultVisible` to
   * open it as a modal dialog.
   */
  open?: boolean
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
   * Callback fired with `false` when the drawer requests to be closed, at the same moments as
   * `onClose`. It makes `visible` and `onVisibleChange` a pair that takes a state setter.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * Which viewport edge the panel slides in from. Always required — there is no default
   * off-screen transform without one.
   */
  placement: 'start' | 'end' | 'top' | 'bottom'
  /**
   * Renders as a drawer only below this breakpoint — inline as a flex container above it.
   */
  responsive?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
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
   * Whether the drawer is open. The drawer is then controlled: a close request only fires
   * `onClose` and `onVisibleChange`, and the drawer closes when this becomes `false`.
   */
  visible?: boolean
}

// Currently-open drawers, so opening one can auto-close any other open drawer
// ("When a second drawer opens while one is already open, the first closes automatically").
const openDrawers = new Set<{ dialog: HTMLDialogElement; close: () => void }>()

export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(
  (
    {
      'aria-labelledby': ariaLabelledBy,
      children,
      backdrop = true,
      className,
      defaultVisible,
      fitContent,
      fullscreen,
      instant,
      keyboard = true,
      onClick,
      onClose,
      onClosePrevented,
      onHidden,
      onKeyDown,
      onShow,
      onShown,
      onVisibleChange,
      placement,
      responsive,
      scroll = false,
      sheet,
      translucent,
      open,
      visible,
      ...rest
    },
    ref
  ) => {
    const {
      close,
      dialogRef,
      forkedRef,
      handleBackdropClick,
      handleCancel,
      handleKeyDown,
      handleNativeClose,
      hiding,
      staticBounce
    } = useDialogElement({
      backdrop,
      defaultVisible,
      instant,
      isModal: Boolean(backdrop) || !scroll,
      keyboard,
      // Modal for its backdrop, the page still scrolls under a `scroll` drawer.
      lockScroll: !scroll,
      onBeforeShow: (dialog) => {
        for (const entry of openDrawers) {
          if (entry.dialog !== dialog) entry.close()
        }
      },
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
    })

    const titleId = useId()
    // Labelled by the title that is rendered, under the id it has, unless the caller names the
    // dialog itself: `aria-labelledby` would outrank that `aria-label`.
    const [labelledBy, registerTitle] = useDialogTitle(() =>
      open
        ? findDialogTitleId(children, { dialog: Drawer, generatedId: titleId, title: DrawerTitle })
        : undefined
    )

    const closeRef = useRef(close)
    closeRef.current = close

    // Register in the cross-instance registry so other drawers can auto-close this one. From a
    // layout effect, as the show effect that reads the registry (`onBeforeShow`) runs: two drawers
    // mounted open in one commit both opened before either was registered, and both stayed open.
    useIsomorphicLayoutEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return undefined
      const entry = { dialog, close: () => closeRef.current() }
      openDrawers.add(entry)
      return () => {
        openDrawers.delete(entry)
      }
    }, [dialogRef])

    // A `responsive` drawer is one only below its breakpoint: above it chassis-css lays the
    // element out in the page. One that is open when the viewport grows past the breakpoint
    // would stay in the top layer, over an inert and scroll-locked page, so it asks to close, as
    // chassis-css's own drawer does on `resize`. Read from the computed `position` like there,
    // not from a width: the breakpoints are the theme's.
    useEffect(() => {
      if (!responsive) return undefined
      const handleResize = () => {
        const dialog = dialogRef.current
        if (!dialog?.open || getComputedStyle(dialog).position === 'fixed') return
        closeRef.current()
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [dialogRef, responsive])

    // `hiding` has to stay on the class list for the whole exit transition: the native `open`
    // attribute — and with it, the `[class*="drawer"]:not([open], .hiding)` escape hatch
    // chassis-css's navbar styles use to suppress the drawer-flash transition when the navbar
    // itself crosses its `expand` breakpoint — would otherwise get stripped the instant `open`
    // is removed, which would also strip the *intentional* close transition this class exists
    // to protect.
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
      <DrawerContext.Provider value={{ close, titleId }}>
        <DrawerTitleContext.Provider value={registerTitle}>
          <dialog
            // Out of `rest`, so a caller's `aria-labelledby={undefined}` (a wrapper forwarding a prop
            // it wasn't given) leaves the title's label in place instead of writing over it.
            aria-labelledby={ariaLabelledBy ?? (rest['aria-label'] ? undefined : labelledBy)}
            // Firefox and Safari put a `<dialog>` without a tabindex in the Tab order, where it takes
            // focus with no ring: a `responsive` drawer shown inline is a stop between its links.
            tabIndex={-1}
            {...rest}
            open={open}
            className={_className}
            onCancel={handleCancel}
            onClick={handleBackdropClick}
            onClose={handleNativeClose}
            onKeyDown={handleKeyDown}
            ref={forkedRef}
          >
            {children}
          </dialog>
        </DrawerTitleContext.Provider>
      </DrawerContext.Provider>
    )
  }
)

Drawer.displayName = 'Drawer'
