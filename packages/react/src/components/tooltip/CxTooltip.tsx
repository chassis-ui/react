import React, { FC, ReactElement, ReactNode, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { Transition } from 'react-transition-group'

import { Triggers } from '../Types'
import { useForkedRef } from '../../utils/hooks'

const FALLBACK_PLACEMENTS: Placement[] = ['top', 'right', 'bottom', 'left']

export type Placement = 'top' | 'right' | 'bottom' | 'left'

export interface CTooltipProps {
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
   * Sets which event handlers you’d like provided to your toggle prop. You can specify one trigger or an array of them.
   *
   * @type 'hover' | 'focus' | 'click'
   */
  trigger?: Triggers | Triggers[]
  /**
   * Describes the preferred placement of your component. Chassis will flip and shift it to keep it in view.
   */
  placement?: Placement
  /**
   * Toggle the visibility of popover component.
   */
  visible?: boolean
}

export const CxTooltip: FC<CTooltipProps> = ({
  children,
  content,
  placement = 'top',
  offset: offsetProp = [0, 6],
  onHide,
  onShow,
  trigger = 'hover',
  visible,
  ...rest
}) => {
  const [_visible, setVisible] = useState(visible)
  const [portalContainer, setPortalContainer] = useState<Element | null>(null)
  const tooltipId = useId()
  const arrowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  // Tooltips inside an open `<dialog>` are appended to that dialog instead of
  // `document.body`, so they render in its top layer and close with it automatically.
  const resolvePortalContainer = () =>
    triggerRef.current?.closest('dialog[open]') ?? document.body

  const show = () => {
    setPortalContainer(resolvePortalContainer())
    setVisible(true)
  }
  const hide = () => setVisible(false)
  const toggle = () => {
    setPortalContainer(resolvePortalContainer())
    setVisible(!_visible)
  }

  // A dialog fires a native `close` event on ESC, backdrop click, or `.close()`, so
  // resetting on it keeps a reopened dialog from showing a stale, already-open tooltip.
  useEffect(() => {
    const dialog = portalContainer?.closest('dialog')
    if (!_visible || !dialog) return

    dialog.addEventListener('close', hide)
    return () => dialog.removeEventListener('close', hide)
  }, [_visible, portalContainer])

  const {
    refs,
    floatingStyles,
    placement: resolvedPlacement,
    middlewareData,
  } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ crossAxis: offsetProp[0], mainAxis: offsetProp[1] }),
      flip({ fallbackPlacements: FALLBACK_PLACEMENTS }),
      shift({ boundary: 'clippingAncestors' }),
      arrow({ element: arrowRef }),
    ],
  })

  const side = resolvedPlacement.split('-')[0]
  const isVertical = side === 'top' || side === 'bottom'
  const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {}
  const forkedFloatingRef = useForkedRef(refs.setFloating, floatingRef)

  const getTransitionClass = (state: string) => {
    return state === 'entering'
      ? 'fade'
      : state === 'entered'
      ? 'fade show'
      : state === 'exiting'
      ? 'fade'
      : 'fade'
  }

  return (
    <>
      {React.cloneElement(children, {
        ref: (node: HTMLElement | null) => {
          refs.setReference(node)
          triggerRef.current = node
        },
        'aria-describedby': _visible ? tooltipId : undefined,
        ...((trigger === 'click' || trigger.includes('click')) && {
          onClick: toggle,
        }),
        ...((trigger === 'focus' || trigger.includes('focus')) && {
          onFocus: show,
          onBlur: hide,
        }),
        ...((trigger === 'hover' || trigger.includes('hover')) && {
          onMouseEnter: show,
          onMouseLeave: hide,
        }),
      })}
      {typeof window !== 'undefined' &&
        createPortal(
          <Transition
            in={_visible}
            mountOnEnter
            nodeRef={floatingRef}
            onEnter={onShow}
            onExit={onHide}
            timeout={{
              enter: 0,
              exit: 200,
            }}
            unmountOnExit
          >
            {(state) => {
              const transitionClass = getTransitionClass(state)
              return (
                <div
                  id={tooltipId}
                  className={classNames('tooltip cx-tooltip-auto', transitionClass)}
                  data-cx-placement={resolvedPlacement}
                  ref={forkedFloatingRef}
                  role="tooltip"
                  style={floatingStyles}
                  {...rest}
                >
                  <div
                    className="tooltip-arrow"
                    ref={arrowRef}
                    style={{
                      position: 'absolute',
                      left: isVertical && arrowX != null ? `${arrowX}px` : undefined,
                      top: !isVertical && arrowY != null ? `${arrowY}px` : undefined,
                    }}
                  ></div>
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
