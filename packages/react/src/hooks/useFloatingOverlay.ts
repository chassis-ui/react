import { CSSProperties, HTMLAttributes, RefObject, useEffect, useRef, useState } from 'react'

export interface UseFloatingOverlayOptions {
  /**
   * Imperatively closes the overlay — called when `visible` syncs to `false` and when the
   * containing `<dialog>` fires its native `close` event. Pass a stable callback (e.g. the
   * trigger state's own `close`) where possible; an inline arrow is fine too, since only its
   * latest value is ever invoked.
   */
  close: () => void
  /**
   * Whether the overlay is currently open — drives `onShow`/`onHide` and portal-container
   * resolution.
   */
  isOpen: boolean
  /**
   * Imperatively opens the overlay — called when `visible` syncs to `true`.
   */
  open: () => void
  onHide?: () => void
  onShow?: () => void
  /**
   * Ref to the element that triggers the overlay, used to resolve which `<dialog>` (if any) it
   * lives inside.
   */
  triggerRef: RefObject<HTMLElement | null>
  /**
   * Controlled visibility prop from the consuming component; `undefined` means uncontrolled.
   */
  visible?: boolean
}

/**
 * Shared portal-container/visibility wiring for `Popover` and `Tooltip`: resolves the `<dialog>`
 * a trigger lives inside (if any), syncs an uncontrolled-by-default `visible` prop to the
 * trigger state, fires `onShow`/`onHide`, and resets on the containing dialog's native `close`
 * event. Positioning-specific concerns (placement, arrow, escape/outside-click dismissal) stay
 * in each component — only this ~80% overlap is shared.
 */
export function useFloatingOverlay({
  close,
  isOpen,
  open,
  onHide,
  onShow,
  triggerRef,
  visible
}: UseFloatingOverlayOptions) {
  const [portalContainer, setPortalContainer] = useState<Element | null>(null)

  // Overlays inside an open `<dialog>` are appended to that dialog instead of `document.body`,
  // so they render in its top layer and close with it automatically.
  const resolvePortalContainer = () => triggerRef.current?.closest('dialog[open]') ?? document.body

  // Sync-on-change, not strictly controlled — matches `Menu`'s `visible` semantics.
  useEffect(() => {
    if (visible === undefined) return
    setPortalContainer(resolvePortalContainer())
    if (visible) open()
    else close()
  }, [visible])

  useEffect(() => {
    if (isOpen) {
      setPortalContainer(resolvePortalContainer())
      onShow?.()
    } else {
      onHide?.()
    }
  }, [isOpen])

  // `close` is read through a ref so this effect only re-subscribes when `isOpen`/
  // `portalContainer` actually change, regardless of whether the caller passes a stable
  // callback or a fresh inline arrow each render.
  const closeRef = useRef(close)
  closeRef.current = close

  // A dialog fires a native `close` event on ESC, backdrop click, or `.close()`, so resetting
  // on it keeps a reopened dialog from showing a stale, already-open overlay.
  useEffect(() => {
    const dialog = portalContainer?.closest('dialog')
    if (!isOpen || !dialog) return

    const handleClose = () => closeRef.current()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [isOpen, portalContainer])

  return portalContainer
}

// `useOverlayPosition`'s `arrowProps.style` sets a single cross-axis offset (`top` for a
// left/right overlay, `left` for a top/bottom one) to the trigger's center point, not the arrow
// element's top-left corner — so it must be recentered by half the arrow's own size on that
// axis. Chassis-css's JS plugin never has this problem since Floating UI's `arrow` middleware
// returns a top-left-corner coordinate directly; react-aria's is center-based. Unlike the
// chassis-css JS plugin, react-aria also never sets `position: absolute` on the arrow element
// itself, so without it the offset has no effect and the arrow renders in normal document flow.
export function getOverlayArrowStyle(arrowProps: HTMLAttributes<HTMLDivElement>): CSSProperties {
  return {
    position: 'absolute',
    ...arrowProps.style,
    transform: arrowProps.style?.top !== undefined ? 'translateY(-50%)' : 'translateX(-50%)'
  }
}

export function getOverlayTransitionClass(transitionState: string): string {
  return transitionState === 'entering'
    ? 'fade'
    : transitionState === 'entered'
      ? 'fade show'
      : transitionState === 'exiting'
        ? 'fade'
        : 'fade'
}
