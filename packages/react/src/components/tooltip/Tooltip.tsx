import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef
} from 'react'
import classNames from 'classnames'
import { mergeProps, useOverlayPosition, useTooltip, useTooltipTrigger } from 'react-aria'
import { useTooltipTriggerState } from 'react-stately'

import {
  getOverlayArrowStyle,
  getOverlayTransitionClass,
  useFloatingOverlay,
  useForkedRef,
  useOpenStateProps,
  useTransitionState
} from '../../hooks'
import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { Portal } from '../../utils/portal'
import { asTriggerElement, getTriggerRef } from '../../utils/triggerElement'

export type { Placement }

// Every attribute besides the component's own props goes to the panel, the `.tooltip` element:
// `className`, `style`, `id`, `data-*`, ARIA attributes and event handlers. So does the ref.
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  /**
   * The trigger: a single element, which shows the tooltip on hover and focus.
   */
  children: ReactElement
  /**
   * Content node for your component.
   */
  content: ReactNode | string
  /**
   * Whether the tooltip is shown when it first renders. Use it instead of `visible` when nothing
   * outside needs to control the tooltip.
   */
  defaultVisible?: boolean
  /**
   * Offset of the tooltip relative to its target, as `[crossAxis, mainAxis]`.
   */
  offset?: [number, number]
  /**
   * Callback fired when the tooltip hides.
   */
  onHide?: () => void
  /**
   * Callback fired when the tooltip shows.
   */
  onShow?: () => void
  /**
   * Callback fired when the tooltip asks to show or hide: hover, focus, blur, the Escape key, or
   * the closing of the dialog it is in. Receives the state it asks for. With `visible` set, the
   * tooltip changes only when `visible` does.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * Describes the preferred placement of your component. Chassis will flip it to keep it in
   * view.
   */
  placement?: Placement
  /**
   * Tooltips always show on focus, since keyboard/screen-reader users need them too. Set to
   * `'focus'` to disable the hover trigger and show on focus only.
   */
  trigger?: 'hover' | 'focus'
  /**
   * Whether the tooltip is shown. Setting it makes the tooltip controlled: it shows and hides
   * only when this changes, so pair it with `onVisibleChange`. Leave it unset, or use
   * `defaultVisible`, for a tooltip that shows and hides itself.
   */
  visible?: boolean
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    children,
    className,
    content,
    defaultVisible,
    placement = 'top',
    offset: offsetProp = [0, 6],
    onHide,
    onShow,
    onVisibleChange,
    style,
    trigger,
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
  // that child — otherwise `<Tooltip><Button ref={mine} /></Tooltip>` silently never populates
  // `mine`. Same reasoning for merging (rather than overwriting) the child's own props below:
  // `triggerProps` carries the focus/hover handlers this component needs, and spreading them raw
  // would drop a handler the caller put on their own trigger.
  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
  }, [])
  const triggerElement = asTriggerElement(children)
  const forkedTriggerRef = useForkedRef<HTMLElement>(setTriggerRef, getTriggerRef(triggerElement))

  // react-stately defaults to a 1500ms warmup delay (and 500ms cooldown) before a first tooltip
  // shows, spectrum-style — chassis-css's own JS plugin defaults to instant (`delay: 0`), so
  // match that here rather than leaving new adopters to wonder why the first hover lags.
  const state = useTooltipTriggerState({
    ...useOpenStateProps({ defaultVisible, onVisibleChange, visible }, 'Tooltip'),
    trigger,
    delay: 0,
    closeDelay: 0
  })
  // While a tooltip is open, react-aria stops every Escape at the document and closes the
  // tooltip with it. One held open by `visible` with no `onVisibleChange` never closes, so it
  // would swallow Escape for the whole page: a popover, a menu or a dialog beside it could no
  // longer be closed by it. Such a tooltip is passed as closed, which is all the hook reads the
  // state for besides `aria-describedby`, set below.
  const isHeld = visible !== undefined && !onVisibleChange
  const { triggerProps, tooltipProps: tooltipTriggerProps } = useTooltipTrigger(
    { trigger },
    isHeld ? { ...state, isOpen: false } : state,
    triggerRef
  )
  const { tooltipProps } = useTooltip({}, state)

  // react-stately shows one tooltip at a time, but counts only a tooltip it opened through
  // `open()`. One shown by `visible` or `defaultVisible` joins here, so the next tooltip to open
  // asks it to hide, and it closes the ones already open.
  const registerOpen = state.open
  useEffect(() => {
    if (state.isOpen) registerOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  // Bypasses the hook's hover-warmup delay (`close`'s `immediate` argument): a containing dialog
  // closing applies right away.
  const portalContainer = useFloatingOverlay({
    close: () => state.close(true),
    isOpen: state.isOpen,
    onHide,
    onShow,
    triggerRef
  })

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
    isOpen: state.isOpen
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
    unmountOnExit: true
  })

  return (
    <>
      {React.cloneElement(triggerElement, {
        ...mergeProps(
          triggerElement.props,
          triggerProps,
          isHeld && state.isOpen ? { 'aria-describedby': tooltipTriggerProps.id } : {}
        ),
        ref: forkedTriggerRef
      })}
      <Portal container={portalContainer}>
        {isMounted && (
          <div
            {...mergeProps(tooltipTriggerProps, tooltipProps, rest)}
            className={classNames(
              'tooltip cx-tooltip-auto',
              getOverlayTransitionClass(phase),
              className
            )}
            data-cx-placement={placementAttr}
            ref={forkedFloatingRef}
            style={floatingStyle}
          >
            <div
              className="tooltip-arrow"
              {...arrowProps}
              style={getOverlayArrowStyle(arrowProps)}
            ></div>
            <div className="tooltip-inner">{content}</div>
          </div>
        )}
      </Portal>
    </>
  )
})

Tooltip.displayName = 'Tooltip'
