import React, { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { Transition } from 'react-transition-group'

import { ContextColor } from '../Types'
import { CxCloseButton } from '../close-button/CxCloseButton'
import { useForkedRef } from '../../hooks'

export interface CxNotificationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context color of the component to one of Chassis themed colors.
   */
  context?: ContextColor
  /**
   * Optionally add a close button to the notification and allow it to self dismiss.
   */
  dismissible?: boolean
  /**
   * Style variant for the notification.
   */
  variant?: 'solid'
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: () => void
  /**
   * Toggle the visibility of component.
   */
  visible?: boolean
}

export const CxNotification = forwardRef<HTMLDivElement, CxNotificationProps>(
  (
    {
      children,
      className,
      context = 'primary',
      dismissible,
      variant,
      visible = true,
      onClose,
      ...rest
    },
    ref
  ) => {
    const [_visible, setVisible] = useState(visible)
    const nodeRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, nodeRef)

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const _className = classNames(
      'notification',
      context && !variant ? context : null,
      {
        [`bg-${context}`]: context && variant === 'solid',
        'fg-white': variant === 'solid'
      },
      className
    )

    const getTransitionClass = (state: string) => {
      return state === 'entered' && 'show'
    }

    return (
      <Transition
        in={_visible}
        mountOnEnter
        nodeRef={nodeRef}
        onExit={onClose}
        timeout={150}
        unmountOnExit
      >
        {(state) => {
          const transitionClass = getTransitionClass(state)
          return (
            <div
              className={classNames(_className, transitionClass)}
              role="alert"
              {...rest}
              ref={forkedRef}
            >
              {children}
              {dismissible && <CxCloseButton onClick={() => setVisible(false)} />}
            </div>
          )
        }}
      </Transition>
    )
  }
)

CxNotification.displayName = 'CxNotification'
