import React, { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { Transition } from 'react-transition-group'

import { ContextColor } from '../../types'
import { CloseButton } from '../close-button/CloseButton'
import { useForkedRef } from '../../hooks'

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Optionally add a close button to the notification and allow it to self dismiss.
   */
  dismissible?: boolean
  /**
   * Applies the solid context style to the notification.
   */
  solid?: boolean
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: () => void
  /**
   * ARIA live-region role. Use `status` (the default) for confirmation, progress, and
   * informational messages, which announce politely. Use `alert` for messages that need
   * immediate attention — validation errors, failed operations — which interrupt speech.
   */
  role?: 'status' | 'alert'
  /**
   * Toggle the visibility of component.
   */
  visible?: boolean
}

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      children,
      className,
      color = 'primary',
      dismissible,
      solid,
      role = 'status',
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
      color,
      {
        solid
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
              role={role}
              {...rest}
              ref={forkedRef}
            >
              {children}
              {dismissible && <CloseButton onClick={() => setVisible(false)} />}
            </div>
          )
        }}
      </Transition>
    )
  }
)

Notification.displayName = 'Notification'
