import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { mergeProps } from 'react-aria'
import { Transition } from 'react-transition-group'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import { useAutoDismiss, useDismissibleTransition } from '../../hooks'
import { ToastContext } from './context'
import { ToastBody } from './ToastBody'
import { ToastFooter } from './ToastFooter'
import { ToastHeader } from './ToastHeader'

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Apply a CSS fade transition to the toast.
   */
  animation?: boolean
  /**
   * Auto hide the toast. The timer starts once the show transition completes and pauses
   * while the pointer is over the toast or focus is within it.
   */
  autohide?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Adds a close button — shorthand for `ToastHeader`'s/`ToastBody`'s `closeButton` prop.
   * Placed in the header when `icon`/`title`/`time` is set; otherwise placed in the body
   * alongside `message`, or in a header containing only the close button if `message` is
   * also unset.
   */
  closeButton?: boolean
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs. Shorthand for `ToastHeader`'s `closeLabel` prop.
   */
  closeLabel?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Delay hiding the toast (ms).
   */
  delay?: number
  /**
   * Trailing content — typically a row of `Button`s — rendered via a single `ToastFooter`,
   * after `message`/`children`. Pass a function to receive `close` directly, instead of
   * calling `useToast()` from a child component to wire up a "Close" action.
   */
  footer?: ReactNode | ((close: () => void) => ReactNode)
  /**
   * Leading icon for the header. A string is rendered as `<ToastIcon name={icon} />`; pass
   * any other node for a fully custom icon (typically a logo or avatar). Shorthand for
   * `ToastHeader`'s `icon` prop; hidden from assistive technology by default, since it
   * duplicates `title` visually.
   */
  icon?: string | ReactNode
  /**
   * Message body, rendered via a single `ToastBody`. For multi-block content, compose
   * `children` manually instead — `message` wraps everything in one element.
   */
  message?: ReactNode
  /**
   * Header timestamp, rendered after `title`. Shorthand for `ToastHeader`'s `time` prop.
   */
  time?: ReactNode
  /**
   * Header heading, rendered before `time`. Shorthand for `ToastHeader`'s children. When set
   * alongside `message`, wires the toast's `aria-labelledby`/`aria-describedby` to them
   * automatically.
   */
  title?: ReactNode
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
  /**
   * ARIA live-region role. Use `status` (the default) for confirmation, progress, and
   * informational messages, which announce politely. Use `alert` for messages that need
   * immediate attention — validation errors, failed operations — which interrupt speech.
   */
  role?: 'status' | 'alert'
  /**
   * Apply a full-color background with inverted text. Only meaningful alongside `color`.
   */
  solid?: boolean
  /**
   * Apply a semi-transparent background.
   */
  translucent?: boolean
  /**
   * Toggle the visibility of component.
   */
  visible?: boolean
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      children,
      animation = true,
      autohide = true,
      className,
      closeButton,
      closeLabel,
      color,
      delay = 5000,
      footer,
      icon,
      message,
      role = 'status',
      solid,
      time,
      title,
      translucent,
      visible = false,
      onClose,
      onShow,
      ...rest
    },
    ref
  ) => {
    const {
      close,
      entered,
      forkedRef,
      getTransitionClass,
      textId,
      titleId,
      transitionProps,
      visible: _visible
    } = useDismissibleTransition({ onClose, onShow, ref, visible })

    // The autohide timer is only meaningful once the show transition has actually finished (see
    // `autohide`'s JSDoc) — gating on `_visible` alone would start it the instant `visible` flips
    // true, while the toast is still fading/sliding in.
    const autoDismissProps = useAutoDismiss({
      enabled: autohide,
      delay,
      visible: _visible && entered,
      onHide: close
    })

    const contextValues = {
      visible: _visible,
      close
    }

    const _className = classNames(
      'toast',
      {
        fade: animation,
        context: !!color,
        solid: Boolean(solid && color),
        translucent
      },
      color,
      className
    )

    const hasHeaderShorthand = icon != null || title != null || time != null
    const headerGetsCloseButton = closeButton && (hasHeaderShorthand || message == null)
    const bodyGetsCloseButton = closeButton && !hasHeaderShorthand && message != null
    const hasHeaderContent = hasHeaderShorthand || headerGetsCloseButton

    return (
      <Transition {...transitionProps} timeout={250}>
        {(state) => {
          const transitionClass = getTransitionClass(state)
          return (
            <ToastContext.Provider value={contextValues}>
              <div
                className={classNames(_className, transitionClass)}
                role={role}
                aria-labelledby={title != null ? titleId : undefined}
                aria-describedby={title != null && message != null ? textId : undefined}
                {...mergeProps(rest, autoDismissProps)}
                ref={forkedRef}
              >
                {hasHeaderContent && (
                  <ToastHeader
                    icon={icon}
                    time={time}
                    titleId={title != null ? titleId : undefined}
                    closeButton={headerGetsCloseButton}
                    closeLabel={closeLabel}
                  >
                    {title}
                  </ToastHeader>
                )}
                {message != null && (
                  <ToastBody
                    id={title != null && message != null ? textId : undefined}
                    closeButton={bodyGetsCloseButton}
                    closeLabel={closeLabel}
                  >
                    {message}
                  </ToastBody>
                )}
                {children}
                {footer != null && (
                  <ToastFooter>{typeof footer === 'function' ? footer(close) : footer}</ToastFooter>
                )}
              </div>
            </ToastContext.Provider>
          )
        }}
      </Transition>
    )
  }
)

Toast.displayName = 'Toast'
