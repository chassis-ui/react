import React, { FC, ReactElement, ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { mergeProps, useOverlayPosition, useTooltip, useTooltipTrigger } from 'react-aria'
import { useTooltipTriggerState } from 'react-stately'
import { Transition } from 'react-transition-group'

import { getOverlayArrowStyle, getOverlayTransitionClass, useFloatingOverlay } from '../../hooks'
import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'

export type { Placement }

export interface TooltipProps {
  children: ReactElement
  /**
   * Content node for your component.
   */
  content: ReactNode | string
  /**
   * Offset of the tooltip relative to its target, as `[crossAxis, mainAxis]`.
   */
  offset?: [number, number]
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
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
   * Toggle the visibility of the tooltip component.
   */
  visible?: boolean
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  offset: offsetProp = [0, 6],
  onHide,
  onShow,
  trigger,
  visible,
  ...rest
}) => {
  const arrowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  // react-stately defaults to a 1500ms warmup delay (and 500ms cooldown) before a first tooltip
  // shows, spectrum-style — chassis-css's own JS plugin defaults to instant (`delay: 0`), so
  // match that here rather than leaving new adopters to wonder why the first hover lags.
  const state = useTooltipTriggerState({ trigger, delay: 0, closeDelay: 0 })
  const { triggerProps, tooltipProps: tooltipTriggerProps } = useTooltipTrigger(
    { trigger },
    state,
    triggerRef
  )
  const { tooltipProps } = useTooltip({}, state)

  // Bypasses the hook's hover-warmup delay (`open`/`close`'s `immediate` argument) since a
  // programmatic `visible` change, an `onShow`/`onHide` sync, or a containing dialog closing
  // should all apply right away, same as before.
  const portalContainer = useFloatingOverlay({
    close: () => state.close(true),
    isOpen: state.isOpen,
    open: () => state.open(true),
    onHide,
    onShow,
    triggerRef,
    visible
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

  const floatingStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement(placement, resolvedPlacement)

  return (
    <>
      {React.cloneElement(children, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node
        },
        ...triggerProps
      })}
      {typeof window !== 'undefined' &&
        createPortal(
          <Transition
            in={state.isOpen}
            mountOnEnter
            nodeRef={floatingRef}
            timeout={{
              enter: 0,
              exit: 200
            }}
            unmountOnExit
          >
            {(transitionState) => {
              const transitionClass = getOverlayTransitionClass(transitionState)
              return (
                <div
                  className={classNames('tooltip cx-tooltip-auto', transitionClass)}
                  data-cx-placement={placementAttr}
                  ref={floatingRef}
                  style={floatingStyle}
                  {...mergeProps(tooltipTriggerProps, tooltipProps)}
                  {...rest}
                >
                  <div
                    className="tooltip-arrow"
                    {...arrowProps}
                    style={getOverlayArrowStyle(arrowProps)}
                  ></div>
                  <div className="tooltip-inner">{content}</div>
                </div>
              )
            }}
          </Transition>,
          portalContainer ?? document.body
        )}
    </>
  )
}

Tooltip.displayName = 'Tooltip'
