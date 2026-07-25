import React, { FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { mergeProps, useOverlayPosition, useTooltip, useTooltipTrigger } from 'react-aria'
import { useTooltipTriggerState } from 'react-stately'
import { Transition } from 'react-transition-group'

import { Placement, resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'

export type { Placement }

export interface CxTooltipProps {
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

export const CxTooltip: FC<CxTooltipProps> = ({
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
  const [portalContainer, setPortalContainer] = useState<Element | null>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  const state = useTooltipTriggerState({ trigger })
  const { triggerProps, tooltipProps: tooltipTriggerProps } = useTooltipTrigger(
    { trigger },
    state,
    triggerRef,
  )
  const { tooltipProps } = useTooltip({}, state)

  // Tooltips inside an open `<dialog>` are appended to that dialog instead of
  // `document.body`, so they render in its top layer and close with it automatically.
  const resolvePortalContainer = () => triggerRef.current?.closest('dialog[open]') ?? document.body

  // Sync-on-change, not strictly controlled — matches `CxMenu`/`CxModal`'s `visible` semantics.
  // Bypasses the hook's hover-warmup delay (`open`/`close`'s `immediate` argument) since a
  // programmatic `visible` change should apply right away, same as before.
  useEffect(() => {
    if (visible === undefined) return
    setPortalContainer(resolvePortalContainer())
    if (visible) state.open(true)
    else state.close(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (state.isOpen) {
      setPortalContainer(resolvePortalContainer())
      onShow?.()
    } else {
      onHide?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  // A dialog fires a native `close` event on ESC, backdrop click, or `.close()`, so
  // resetting on it keeps a reopened dialog from showing a stale, already-open tooltip.
  useEffect(() => {
    const dialog = portalContainer?.closest('dialog')
    if (!state.isOpen || !dialog) return

    const hide = () => state.close(true)
    dialog.addEventListener('close', hide)
    return () => dialog.removeEventListener('close', hide)
  }, [state.isOpen, portalContainer])

  const { overlayProps, arrowProps, placement: resolvedPlacement } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: floatingRef,
    placement: toAriaPlacement(placement),
    offset: offsetProp[1],
    crossOffset: offsetProp[0],
    arrowSize: 8,
    arrowRef,
    isOpen: state.isOpen,
  })

  const floatingStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left,
  }
  const placementAttr = resolveDataPlacement(placement, resolvedPlacement)

  const getTransitionClass = (transitionState: string) => {
    return transitionState === 'entering'
      ? 'fade'
      : transitionState === 'entered'
      ? 'fade show'
      : transitionState === 'exiting'
      ? 'fade'
      : 'fade'
  }

  return (
    <>
      {React.cloneElement(children, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node
        },
        ...triggerProps,
      })}
      {typeof window !== 'undefined' &&
        createPortal(
          <Transition
            in={state.isOpen}
            mountOnEnter
            nodeRef={floatingRef}
            timeout={{
              enter: 0,
              exit: 200,
            }}
            unmountOnExit
          >
            {(transitionState) => {
              const transitionClass = getTransitionClass(transitionState)
              return (
                <div
                  className={classNames('tooltip cx-tooltip-auto', transitionClass)}
                  data-cx-placement={placementAttr}
                  ref={floatingRef}
                  style={floatingStyle}
                  {...mergeProps(tooltipTriggerProps, tooltipProps)}
                  {...rest}
                >
                  <div className="tooltip-arrow" {...arrowProps}></div>
                  <div className="tooltip-inner">{content}</div>
                </div>
              )
            }}
          </Transition>,
          portalContainer ?? document.body,
        )}
    </>
  )
}

CxTooltip.displayName = 'CxTooltip'
