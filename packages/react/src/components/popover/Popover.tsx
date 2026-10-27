import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  useEffect,
  useId,
  useRef
} from 'react'
import classNames from 'classnames'
import { mergeProps, useDialog, useOverlayPosition, useOverlayTrigger } from 'react-aria'
import { useOverlayTriggerState } from 'react-stately'

import {
  getOverlayArrowStyle,
  getOverlayTransitionClass,
  useFloatingOverlay,
  useForkedRef,
  useOpenStateProps,
  useOverlayMaxHeight,
  useTransitionState
} from '../../hooks'
import { insideEventProps, isEventInside } from '../../utils/insideEvents'
import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { pushOverlay } from '../../utils/overlayStack'
import { useHydrated } from '../../hooks/useHydrated'
import { Portal } from '../portal/Portal'
import { getTriggerChild, renderSlotted } from '../../utils/slot'

interface PopoverPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'content'> {
  arrowProps: HTMLAttributes<HTMLDivElement>
  content: ReactNode | string
  overlayRef: Ref<HTMLDivElement>
  overlayTriggerProps: HTMLAttributes<HTMLDivElement>
  title?: ReactNode | string
}

// A distinct component (rather than inline JSX in `Popover`) so `useDialog`'s own mount-focus
// effect — which only fires on this component's mount, not on `overlayRef.current` merely
// becoming non-null — actually runs each time the popover opens. `Popover` unmounts this once
// it has exited and mounts it again on every open, giving `useDialog` a fresh mount each time.
const PopoverPanel = ({
  arrowProps,
  content,
  overlayRef,
  overlayTriggerProps,
  title,
  ...rest
}: PopoverPanelProps) => {
  // `useDialog` focuses the panel through a ref object; the caller's ref is forked onto the same
  // node.
  const panelRef = useRef<HTMLDivElement>(null)
  const forkedRef = useForkedRef(overlayRef, panelRef)
  // The caller's name goes to `useDialog`, which then labels the panel by its title only when the
  // caller gave none: left in `rest`, an `aria-label` sat beside the title's `aria-labelledby`,
  // which outranks it.
  const { dialogProps, titleProps } = useDialog(
    { 'aria-label': rest['aria-label'], 'aria-labelledby': rest['aria-labelledby'] },
    panelRef
  )

  return (
    <div {...mergeProps(overlayTriggerProps, dialogProps, rest)} ref={forkedRef}>
      <div className="popover-arrow" {...arrowProps} style={getOverlayArrowStyle(arrowProps)}></div>
      {title && (
        <div className="popover-header" {...titleProps}>
          {title}
        </div>
      )}
      <div className="popover-body">{content}</div>
    </div>
  )
}

// Every attribute besides the component's own props goes to the panel, the `.popover` element:
// `className`, `style`, `id`, `data-*`, ARIA attributes and event handlers. So does the ref.
export interface PopoverProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'content' | 'title'
> {
  /**
   * The trigger: a single element, which opens the popover on click.
   */
  children: ReactElement
  /**
   * Content node for your component.
   */
  content: ReactNode | string
  /**
   * Whether the popover is open when it first renders. Use it instead of `visible` when nothing
   * outside needs to control the popover.
   */
  defaultVisible?: boolean
  /**
   * Offset of the popover relative to its target, as `[crossAxis, mainAxis]`.
   */
  offset?: [number, number]
  /**
   * Callback fired when the popover hides.
   */
  onHide?: () => void
  /**
   * Callback fired when the popover shows.
   */
  onShow?: () => void
  /**
   * Callback fired when the popover asks to show or hide: a click on the trigger, a click
   * outside, the Escape key, or the closing of the dialog it is in. Receives the state it asks
   * for. With `visible` set, the popover changes only when `visible` does.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * Title node for your component.
   */
  title?: ReactNode | string
  /**
   * Describes the preferred placement of your component. Chassis will flip it to keep it in
   * view.
   */
  placement?: Placement
  /**
   * Whether the popover is open. Setting it makes the popover controlled: it shows and hides
   * only when this changes, so pair it with `onVisibleChange`. Leave it unset, or use
   * `defaultVisible`, for a popover that opens and closes itself.
   */
  visible?: boolean
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    'aria-labelledby': ariaLabelledBy,
    children,
    className,
    content,
    defaultVisible,
    placement = 'right',
    offset: offsetProp = [0, 8],
    onHide,
    onShow,
    onVisibleChange,
    style,
    title,
    visible,
    ...rest
  },
  ref
) {
  const arrowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const forkedFloatingRef = useForkedRef(ref, floatingRef)

  // The trigger is rendered as `asChild` renders a child (`renderSlotted`): the child's own
  // `onClick` chains after this one, and `triggerRef` is forked with the ref the caller put on
  // the child. `triggerProps` state the popover's condition (`aria-expanded`, `aria-controls`),
  // so they win over the child's own.
  const triggerElement = getTriggerChild(children, 'Popover')

  // A popover is a dialog, which needs a name. With no `title` to label it and none given, it is
  // named by its trigger, under the trigger's own id when it has one. `aria-labelledby` is kept
  // out of `rest`: spread after this, a caller's `aria-labelledby={undefined}` wrote over it.
  const generatedId = useId()
  const triggerId =
    triggerElement && !title && rest['aria-label'] == null && ariaLabelledBy == null
      ? ((triggerElement.props.id as string | undefined) ?? `${generatedId}-trigger`)
      : undefined

  const state = useOverlayTriggerState(
    useOpenStateProps({ defaultVisible, onVisibleChange, visible }, 'Popover')
  )
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    triggerProps: { onPress: _onPress, ...triggerProps },
    overlayProps: overlayTriggerProps
  } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef)

  const portalContainer = useFloatingOverlay({
    close: state.close,
    isOpen: state.isOpen,
    onHide,
    onShow,
    triggerRef
  })

  // A popover held open by `visible` with no `onVisibleChange` can't close on the key, and takes no
  // place in the stack: on top of it, it prevented every Escape, so a dialog under it couldn't
  // close either. `Tooltip` keeps such a tooltip out of react-aria's Escape handling the same way.
  const isHeld = visible !== undefined && !onVisibleChange

  // Escape should always close the popover, regardless of where focus currently is — a
  // mouse-opened popover leaves focus on the trigger, not inside the panel. Through the stack of
  // open overlays, so the key closes this popover only while nothing opened since is still open
  // (a menu or another popover in its content), and never the dialog around it with it.
  // `onExited` below already returns focus to the trigger once the exit transition finishes, so
  // this doesn't need to do that itself.
  useEffect(() => {
    if (!state.isOpen || isHeld) return undefined
    return pushOverlay({
      nodes: () => [floatingRef.current, triggerRef.current],
      onEscape: () => state.close()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, state.close, isHeld])

  // A press outside closes the popover. A press rather than a click, as `ContextMenu` reads it:
  // an element its own click handler takes out of the document (a chip's remove button) is no
  // longer inside anything by the time a click listener here would ask. Inside is the trigger,
  // and anything React renders under the panel, wherever it is portaled (`insideEvents`): a
  // popover or a menu opened from the content, a date picker's calendar.
  // Deferred so a press whose own handler opens the popover doesn't close it again on its way
  // up to `window`.
  useEffect(() => {
    if (!state.isOpen) return undefined

    // By the event's path rather than its target: a trigger inside a shadow root is seen from
    // `window` as the shadow host, which the trigger doesn't contain, so pressing the trigger
    // closed the popover and its click opened it again.
    const isInside = (path: EventTarget[], node: Element | null) => !!node && path.includes(node)

    const handleDismiss = (event: PointerEvent) => {
      const path = event.composedPath()
      if (isInside(path, triggerRef.current)) return
      if (isInside(path, floatingRef.current) || isEventInside(event, floatingRef)) return
      state.close()
    }

    const id = window.setTimeout(() => {
      window.addEventListener('pointerdown', handleDismiss)
    })

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('pointerdown', handleDismiss)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, state.close])

  const {
    overlayProps,
    arrowProps,
    placement: resolvedPlacement
  } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: floatingRef,
    placement: toAriaPlacement(placement),
    offset: offsetProp[1],
    crossOffset: offsetProp[0],
    arrowSize: 8,
    arrowRef,
    isOpen: state.isOpen,
    // `useOverlayPosition` closes on any window scroll via a backward-compat `WeakMap` that
    // `useOverlayTrigger` populates for `triggerRef.current` above. Passing `null` opts out so
    // the popover repositions with its trigger instead of vanishing — matching
    // `Autocomplete`/`Combobox`, neither of which is wired into that map.
    onClose: null
  })

  // The hook writes the room it finds as an inline `max-height` on the panel itself; the panel is
  // as tall as its content (`useOverlayMaxHeight`).
  useOverlayMaxHeight(floatingRef, state.isOpen, 'release')

  // The caller's `style` first: the position is the component's to set.
  const floatingStyle: React.CSSProperties = {
    ...style,
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement(placement, resolvedPlacement)

  // The panel mounts once its container is known (`useFloatingOverlay`), and only there.
  const { isMounted, phase } = useTransitionState({
    in: state.isOpen && portalContainer !== null,
    mountOnEnter: true,
    nodeRef: floatingRef,
    onExited: () => {
      const trigger = triggerRef.current
      if (!trigger || !document.contains(trigger)) return
      // Only reclaim focus when the popover still owns it, or when nothing does.
      // `useDialog` moves focus into the panel on open, so the panel still holds it here
      // for an Escape/inside close (`onExited` runs before the panel is taken out of the DOM,
      // so this reads the pre-removal state); an outside click on plain page
      // content instead leaves focus loose on `<body>`. Both are worth restoring. Any
      // other active element means the user deliberately put focus there — dismissing by
      // clicking another control, or the app closing the popover via `visible` while
      // they were typing somewhere else — and this used to steal it straight back off
      // them. Mirrors react-aria's own `shouldRestoreFocus` condition.
      const active = document.activeElement
      const focusIsLoose = !active || active === document.body
      const focusIsInPanel = !!active && !!floatingRef.current?.contains(active)
      if (!focusIsLoose && !focusIsInPanel) return
      trigger.focus()
    },
    unmountOnExit: true
  })

  // The panel is portaled, so it exists only once hydration has finished: until then the trigger
  // doesn't point `aria-controls` at it, or its HTML would refer to an id no element has.
  const hydrated = useHydrated()

  return (
    <>
      {triggerElement
        ? renderSlotted(
            triggerElement,
            { ...(triggerId && { id: triggerId }), onClick: () => state.toggle() },
            triggerRef,
            hydrated ? triggerProps : { ...triggerProps, 'aria-controls': undefined }
          )
        : children}
      <Portal container={portalContainer}>
        {isMounted && (
          <PopoverPanel
            className={classNames(
              'popover cx-popover-auto',
              getOverlayTransitionClass(phase),
              className
            )}
            data-cx-placement={placementAttr}
            style={floatingStyle}
            overlayTriggerProps={overlayTriggerProps}
            overlayRef={forkedFloatingRef}
            arrowProps={arrowProps}
            title={title}
            content={content}
            aria-labelledby={ariaLabelledBy ?? triggerId}
            {...mergeProps(rest, insideEventProps(floatingRef))}
          />
        )}
      </Portal>
    </>
  )
})

Popover.displayName = 'Popover'
