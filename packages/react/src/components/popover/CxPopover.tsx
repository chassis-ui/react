import React, { FC, ReactElement, ReactNode, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { Manager, Popper, Reference } from 'react-popper'
import { Transition } from 'react-transition-group'

import { Triggers } from '../Types'

export interface CPopoverProps {
  children: ReactElement
  /**
   * Content node for your component.
   */
  content: ReactNode | string
  /**
   * Offset of the popover relative to its target.
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
   * Describes the placement of your component after Popper.js has applied all the modifiers that may have flipped or altered the originally provided placement property.
   */
  placement?: 'auto' | 'top' | 'right' | 'bottom' | 'left'
  /**
   * Toggle the visibility of popover component.
   */
  visible?: boolean
}

export const CxPopover: FC<CPopoverProps> = ({
  children,
  content,
  placement = 'top',
  offset = [0, 8],
  onHide,
  onShow,
  title,
  trigger = 'click',
  visible,
  ...rest
}) => {
  const [_visible, setVisible] = useState(visible)
  const popoverId = useId()

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
    <Manager>
      <Reference>
        {({ ref }) =>
          React.cloneElement(children, {
            ref: ref,
            'aria-describedby': _visible ? popoverId : undefined,
            ...((trigger === 'click' || trigger.includes('click')) && {
              onClick: () => setVisible(!_visible),
            }),
            ...((trigger === 'focus' || trigger.includes('focus')) && {
              onFocus: () => setVisible(true),
              onBlur: () => setVisible(false),
            }),
            ...((trigger === 'hover' || trigger.includes('hover')) && {
              onMouseEnter: () => setVisible(true),
              onMouseLeave: () => setVisible(false),
            }),
          })
        }
      </Reference>
      {typeof window !== 'undefined' &&
        createPortal(
          <Transition
            in={_visible}
            onEnter={onShow}
            onExit={onHide}
            mountOnEnter
            timeout={{
              enter: 0,
              exit: 200,
            }}
            unmountOnExit
          >
            {(state) => {
              const transitionClass = getTransitionClass(state)
              return (
                <Popper
                  placement={placement}
                  modifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: offset,
                      },
                    },
                  ]}
                >
                  {({ arrowProps, style, ref }) => (
                    <div
                      id={popoverId}
                      className={classNames(
                        `popover bs-popover-${
                          placement === 'left' ? 'start' : placement === 'right' ? 'end' : placement
                        }`,
                        transitionClass,
                      )}
                      ref={ref}
                      role="tooltip"
                      style={style}
                      {...rest}
                    >
                      <div className="popover-arrow" {...arrowProps}></div>
                      <div className="popover-header">{title}</div>
                      <div className="popover-body">{content}</div>
                    </div>
                  )}
                </Popper>
              )
            }}
          </Transition>,
          document.body,
        )}
    </Manager>
  )
}

CxPopover.displayName = 'CxPopover'
