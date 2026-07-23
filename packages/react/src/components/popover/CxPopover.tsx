import React, { FC, ReactElement, ReactNode, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { Transition } from 'react-transition-group'

import { Triggers } from '../Types'
import { Placement } from '../tooltip/CxTooltip'
import { useForkedRef } from '../../utils/hooks'

const FALLBACK_PLACEMENTS: Placement[] = ['top', 'right', 'bottom', 'left']

export interface CPopoverProps {
  children: ReactElement
  /**
   * Content node for your component.
   */
  content: ReactNode | string
  /**
   * Offset of the popover relative to its target, as `[crossAxis, mainAxis]`.
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
   * Title node for your component.
   */
  title?: ReactNode | string
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

export const CxPopover: FC<CPopoverProps> = ({
  children,
  content,
  placement = 'right',
  offset: offsetProp = [0, 8],
  onHide,
  onShow,
  title,
  trigger = 'click',
  visible,
  ...rest
}) => {
  const [_visible, setVisible] = useState(visible)
  const [portalContainer, setPortalContainer] = useState<Element | null>(null)
  const popoverId = useId()
  const arrowRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  // Popovers inside an open `<dialog>` are appended to that dialog instead of
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
  // resetting on it keeps a reopened dialog from showing a stale, already-open popover.
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
        'aria-describedby': _visible ? popoverId : undefined,
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
            onEnter={onShow}
            onExit={onHide}
            mountOnEnter
            nodeRef={floatingRef}
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
                  id={popoverId}
                  className={classNames('popover cx-popover-auto', transitionClass)}
                  data-cx-placement={resolvedPlacement}
                  ref={forkedFloatingRef}
                  role="tooltip"
                  style={floatingStyles}
                  {...rest}
                >
                  <div
                    className="popover-arrow"
                    ref={arrowRef}
                    style={{
                      position: 'absolute',
                      left: isVertical && arrowX != null ? `${arrowX}px` : undefined,
                      top: !isVertical && arrowY != null ? `${arrowY}px` : undefined,
                    }}
                  ></div>
                  <div className="popover-header">{title}</div>
                  <div className="popover-body">{content}</div>
                </div>
              )
            }}
          </Transition>,
          portalContainer ?? document.body,
        )}
    </>
  )
}

CxPopover.displayName = 'CxPopover'
