import React, {
  ElementType,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import { mergeProps } from 'react-aria'
import { Transition } from 'react-transition-group'

import { ContextColor } from '../../types'
import { CloseButton } from '../close-button/CloseButton'
import { useAutoDismiss, useForkedRef } from '../../hooks'
import { NotificationContext } from './context'
import { NotificationIcon } from './NotificationIcon'
import { NotificationText } from './NotificationText'
import { NotificationTitle } from './NotificationTitle'

export interface NotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Optional trailing content — e.g. a row of `Button`s — rendered after `text`/`children`.
   */
  actions?: ReactNode
  /**
   * Automatically dismiss the notification after `delay`. The timer pauses while the pointer
   * or focus is on the notification, and only starts once the notification is visible.
   * Defaults to `false` — unlike `Toast`, notifications are persistent banners by default.
   */
  autohide?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Overrides the dismiss button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Delay in ms before an `autohide` notification dismisses itself.
   */
  delay?: number
  /**
   * Optionally add a close button to the notification and allow it to self dismiss.
   */
  dismissible?: boolean
  /**
   * Leading icon. A string is rendered as `<NotificationIcon name={icon} />`; pass any other
   * node for a fully custom icon. Automatically top-aligns with `title` when both are set —
   * a custom icon node is responsible for its own alignment.
   */
  icon?: string | ReactNode
  /**
   * Applies the solid context style to the notification.
   */
  solid?: boolean
  /**
   * Message body, rendered via a single `<NotificationText>`. For multi-block content, compose
   * `children` manually instead — `text` wraps everything in one element.
   */
  text?: ReactNode
  /**
   * Heading, rendered via `<NotificationTitle>`.
   */
  title?: ReactNode
  /**
   * Element or component used for the `title` heading. Passed through to `NotificationTitle`'s
   * own `component` prop. Defaults to `'h4'`.
   */
  titleComponent?: string | ElementType
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
      actions,
      autohide = false,
      children,
      className,
      closeLabel = 'Close',
      color = 'primary',
      delay = 5000,
      dismissible,
      icon,
      solid,
      text,
      title,
      titleComponent = 'h4',
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
    const titleId = useId()
    const textId = useId()

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const hide = () => setVisible(false)

    const autoDismissProps = useAutoDismiss({
      enabled: autohide,
      delay,
      visible: _visible,
      onHide: hide
    })

    const _className = classNames(
      'notification',
      color,
      {
        solid
      },
      className
    )

    const getTransitionClass = (state: string) => {
      return (state === 'entering' || state === 'entered') && 'show'
    }

    return (
      <Transition
        in={_visible}
        mountOnEnter
        nodeRef={nodeRef}
        onExited={onClose}
        timeout={150}
        unmountOnExit
      >
        {(state) => {
          const transitionClass = getTransitionClass(state)
          return (
            <NotificationContext.Provider value={{ visible: _visible, close: hide }}>
              <div
                className={classNames(_className, transitionClass)}
                role={role}
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={title && text ? textId : undefined}
                {...mergeProps(rest, autoDismissProps)}
                ref={forkedRef}
              >
                {icon &&
                  (typeof icon === 'string' ? (
                    <NotificationIcon
                      name={icon}
                      className={title ? 'align-self-start' : undefined}
                    />
                  ) : (
                    icon
                  ))}
                {title && (
                  <NotificationTitle id={titleId} component={titleComponent}>
                    {title}
                  </NotificationTitle>
                )}
                {text && <NotificationText id={textId}>{text}</NotificationText>}
                {children}
                {actions}
                {dismissible && <CloseButton label={closeLabel} onClick={hide} />}
              </div>
            </NotificationContext.Provider>
          )
        }}
      </Transition>
    )
  }
)

Notification.displayName = 'Notification'
