import { CSSProperties, HTMLAttributes, RefObject, useEffect, useRef, useState } from 'react'

import { TransitionPhase } from './useTransitionState'

export interface UseFloatingOverlayOptions {
  /**
   * Imperatively closes the overlay — called when the containing `<dialog>` fires its native
   * `close` event. Pass a stable callback (e.g. the trigger state's own `close`) where possible;
   * an inline arrow is fine too, since only its latest value is ever invoked.
   */
  close: () => void
  /**
   * Whether the overlay is currently open — drives `onShow`/`onHide` and portal-container
   * resolution.
   */
  isOpen: boolean
  onHide?: () => void
  onShow?: () => void
  /**
   * Ref to the element that triggers the overlay, used to resolve which `<dialog>` (if any) it
   * lives inside.
   */
  triggerRef: RefObject<HTMLElement | null>
}

// The open dialog a trigger is in, where its overlay is portaled, so it renders in that dialog's
// top layer and closes with it. `document.body` otherwise.
const resolvePortalContainer = (trigger: HTMLElement): Element =>
  trigger.closest('dialog[open]') ?? document.body

/**
 * Shared portal-container/visibility wiring for `Popover` and `Tooltip`: resolves the `<dialog>`
 * a trigger lives inside (if any), `null` while an open overlay's isn't known yet, fires `onShow`/`onHide`, and resets on the containing dialog's
 * native `close` event. The open state itself is the trigger state's, which each component builds
 * from `visible`/`defaultVisible`/`onVisibleChange` (`toOpenStateProps`). Positioning-specific
 * concerns (placement, arrow, escape/outside-click dismissal) stay in each component.
 */
export function useFloatingOverlay({
  close,
  isOpen,
  onHide,
  onShow,
  triggerRef
}: UseFloatingOverlayOptions): Element | null {
  // The container, and whether it was resolved for the open that is current.
  const [portal, setPortal] = useState<{ container: Element; open: boolean } | null>(null)

  // Resolved in the render that opens the overlay, while the trigger the user pressed is in the
  // DOM, so the panel mounts straight into its container. A passive effect resolved it after the
  // panel had mounted into `document.body`: inside a dialog the panel then mounted a second time,
  // its effects ran twice, its state was lost and its first fade with it.
  if (isOpen && !portal?.open && triggerRef.current) {
    setPortal({ container: resolvePortalContainer(triggerRef.current), open: true })
  } else if (!isOpen && portal?.open) {
    setPortal({ container: portal.container, open: false })
  }

  // Checked again once the commit is done, after the layout effects that open dialogs: an overlay
  // mounted open has no trigger element in its first render, and one opened in the same commit
  // as the dialog around it found that dialog still closed. Only these move the panel. An overlay
  // waits for its container (`null` while open), so one mounted open mounts its panel once too.
  useEffect(() => {
    const trigger = triggerRef.current
    if (!isOpen || !trigger) return
    const container = resolvePortalContainer(trigger)
    setPortal((current) =>
      current?.open && current.container === container ? current : { container, open: true }
    )
  }, [isOpen])

  // `onShow`/`onHide` report changes of the open state, against the value of the last run: not
  // the first commit (mounting closed is not a hide, mounting open not a show), and not
  // StrictMode's second run of the effect on mount, which a `mounted` flag let through.
  const reportedOpenRef = useRef(isOpen)
  useEffect(() => {
    if (reportedOpenRef.current === isOpen) return
    reportedOpenRef.current = isOpen
    if (isOpen) onShow?.()
    else onHide?.()
  }, [isOpen])

  // `null` while the container of the current open isn't known yet. Kept through the exit, so a
  // closing panel stays where it is.
  const portalContainer = isOpen && !portal?.open ? null : (portal?.container ?? null)

  // `close` is read through a ref so this effect only re-subscribes when `isOpen`/
  // `portalContainer` actually change, regardless of whether the caller passes a stable
  // callback or a fresh inline arrow each render.
  const closeRef = useRef(close)
  closeRef.current = close

  // A dialog fires a native `close` event on ESC, backdrop click, or `.close()`, so resetting
  // on it keeps a reopened dialog from showing a stale, already-open overlay. The event comes
  // from a task the browser queues: a dialog that is open again by then has not closed, and an
  // overlay opened in it stays (`useDialogElement`'s `handleNativeClose`).
  useEffect(() => {
    const dialog = portalContainer?.closest('dialog')
    if (!isOpen || !dialog) return

    const handleClose = () => {
      if (!dialog.open) closeRef.current()
    }
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

// Mounted without `show`, shown once those styles are computed, and without it again for as
// long as the exit lasts: chassis-css's `.fade` transitions the opacity between the two.
export function getOverlayTransitionClass(phase: TransitionPhase): string {
  return phase === 'entering' || phase === 'entered' ? 'fade show' : 'fade'
}
