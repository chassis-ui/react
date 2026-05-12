import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Transition } from 'react-transition-group'

import { Colors, contextPropType } from '../Types'
import { CxCloseButton } from '../close-button/CxCloseButton'

export interface CNotificationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Bootstrap React’s themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context: Colors
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

export const CxNotification = forwardRef<HTMLDivElement, CNotificationProps>(
  (
    { children, className, context = 'primary', dismissible, variant, visible = true, onClose, ...rest },
    ref,
  ) => {
    const [_visible, setVisible] = useState(visible)

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const _className = classNames(
      'notification',
      context && !variant ? context : null,
      {
        [`bg-${context}`]: context && variant === 'solid',
        'fg-white': variant === 'solid',
      },
      className,
    )

    const getTransitionClass = (state: string) => {
      return state === 'entered' && 'show'
    }

    return (
      <Transition in={_visible} mountOnEnter onExit={onClose} timeout={150} unmountOnExit>
        {(state) => {
          const transitionClass = getTransitionClass(state)
          return (
            <div
              className={classNames(_className, transitionClass)}
              role="alert"
              {...rest}
              ref={ref}
            >
              {children}
              {dismissible && <CxCloseButton onClick={() => setVisible(false)} />}
            </div>
          )
        }}
      </Transition>
    )
  },
)

CxNotification.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  context: contextPropType.isRequired,
  dismissible: PropTypes.bool,
  variant: PropTypes.oneOf(['solid']),
  onClose: PropTypes.func,
  visible: PropTypes.bool,
}

CxNotification.displayName = 'CxNotification'
