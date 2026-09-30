import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
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
  useTransitionState
} from '../../hooks'
import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { Portal, useHydrated } from '../../utils/portal'
import { asTriggerElement, getTriggerRef } from '../../utils/triggerElement'

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
  const { dialogProps, titleProps } = useDialog({}, panelRef)

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

  // `cloneElement`'s config replaces the child's own `ref` outright rather than merging with it,
  // so capturing the trigger node has to be forked with whatever ref the caller already put on
  // that child — otherwise `<Popover><Button ref={mine} /></Popover>` silently never populates
  // `mine`.
  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
  }, [])
  const triggerElement = asTriggerElement(children)
  const forkedTriggerRef = useForkedRef<HTMLElement>(setTriggerRef, getTriggerRef(triggerElement))

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

  // Escape should always close the popover, regardless of where focus currently is — a
  // mouse-opened popover leaves focus on the trigger, not inside the panel. Mirrors
  // `Menu.tsx`'s own window-level Escape handling. `onExited` below already returns focus to the
  // trigger once the exit transition finishes, so this doesn't need to do that itself.
  useEffect(() => {
    if (!state.isOpen) return undefined

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      state.close()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, state.close])

  // Deferred so the click that opened the popover doesn't immediately close it again — mirrors
  // `Menu.tsx`'s own outside-click handling.
  useEffect(() => {
    if (!state.isOpen) return undefined

    const handleDismiss = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (floatingRef.current?.contains(target)) return
      state.close()
    }

    const id = window.setTimeout(() => {
      window.addEventListener('click', handleDismiss)
    })

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('click', handleDismiss)
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

  // The caller's `style` first: the position is the component's to set.
  const floatingStyle: React.CSSProperties = {
    ...style,
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement(placement, resolvedPlacement)

  const { isMounted, phase } = useTransitionState({
    in: state.isOpen,
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
      {/* `mergeProps` chains the child's own `onClick` ahead of this one, so this no longer
          calls `children.props.onClick` itself the way it did when it spread `triggerProps`
          raw — doing both would fire the caller's handler twice per click. */}
      {React.cloneElement(triggerElement, {
        ...mergeProps(
          triggerElement.props,
          hydrated ? triggerProps : { ...triggerProps, 'aria-controls': undefined },
          { onClick: () => state.toggle() }
        ),
        ref: forkedTriggerRef
      })}
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
            {...rest}
          />
        )}
      </Portal>
    </>
  )
})

Popover.displayName = 'Popover'
