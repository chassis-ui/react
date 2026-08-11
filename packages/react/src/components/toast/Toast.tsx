import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import { Transition } from 'react-transition-group'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import { useForkedRef } from '../../hooks'
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
   * Adds a close button to the auto-rendered header — shorthand for `ToastHeader`'s
   * `closeButton` prop. Renders a header containing only the close button if `image`/`title`/
   * `time` are all unset.
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
   * after `message`/`children`.
   */
  footer?: ReactNode
  /**
   * Leading visual for the header — typically a logo or avatar. Shorthand for `ToastHeader`'s
   * `image` prop; hidden from assistive technology by default, since it duplicates `title`
   * visually.
   */
  image?: ReactNode
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
   * Header heading, rendered before `time`. Shorthand for `ToastHeader`'s `title` prop. When
   * set alongside `message`, wires the toast's `aria-labelledby`/`aria-describedby` to them
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
      image,
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
    const [_visible, setVisible] = useState(false)
    const timeout = useRef<number>()
    const hasMouseInteraction = useRef(false)
    const hasKeyboardInteraction = useRef(false)
    const nodeRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, nodeRef)
    const titleId = useId()
    const textId = useId()

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const contextValues = {
      visible: _visible,
      setVisible
    }

    // triggered on mount and destroy
    useEffect(() => () => _clearAutohideTimeout(), [])

    // Re-evaluates whenever `_visible`, `autohide` or `delay` change, so a mid-display change to
    // `autohide`/`delay` reschedules (or cancels) the pending timer immediately, instead of only
    // taking effect on the next `_visible` toggle.
    useEffect(() => {
      _maybeScheduleHide()
    }, [_visible, autohide, delay]) // eslint-disable-line react-hooks/exhaustive-deps

    const _clearAutohideTimeout = () => {
      clearTimeout(timeout.current)
      timeout.current = undefined
    }

    // The autohide timer only starts once neither the pointer nor focus is
    // interacting with the toast, mirroring Chassis CSS's toast.js behavior.
    const _maybeScheduleHide = () => {
      _clearAutohideTimeout()
      if (!autohide || hasMouseInteraction.current || hasKeyboardInteraction.current) {
        return
      }
      timeout.current = window.setTimeout(() => {
        setVisible(false)
      }, delay)
    }

    const _onMouseEnter = () => {
      hasMouseInteraction.current = true
      _clearAutohideTimeout()
    }

    const _onMouseLeave = () => {
      hasMouseInteraction.current = false
      _maybeScheduleHide()
    }

    const _onFocus = () => {
      hasKeyboardInteraction.current = true
      _clearAutohideTimeout()
    }

    const _onBlur = () => {
      hasKeyboardInteraction.current = false
      _maybeScheduleHide()
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

    const getTransitionClass = (state: string) => {
      return state === 'entering' || state === 'exiting'
        ? 'showing'
        : state === 'entered'
          ? 'show'
          : undefined
    }

    const hasHeaderContent = image != null || title != null || time != null || closeButton

    return (
      <Transition
        in={_visible}
        nodeRef={nodeRef}
        onEnter={() => onShow?.()}
        onExited={() => onClose?.()}
        timeout={250}
        unmountOnExit
      >
        {(state) => {
          const transitionClass = getTransitionClass(state)
          return (
            <ToastContext.Provider value={contextValues}>
              <div
                className={classNames(_className, transitionClass)}
                role={role}
                aria-labelledby={title != null ? titleId : undefined}
                aria-describedby={title != null && message != null ? textId : undefined}
                onMouseEnter={_onMouseEnter}
                onMouseLeave={_onMouseLeave}
                onFocus={_onFocus}
                onBlur={_onBlur}
                {...rest}
                ref={forkedRef}
              >
                {hasHeaderContent && (
                  <ToastHeader
                    image={image}
                    title={title}
                    time={time}
                    titleId={title != null ? titleId : undefined}
                    closeButton={closeButton}
                    closeLabel={closeLabel}
                  />
                )}
                {message != null && (
                  <ToastBody id={title != null && message != null ? textId : undefined}>
                    {message}
                  </ToastBody>
                )}
                {children}
                {footer != null && <ToastFooter>{footer}</ToastFooter>}
              </div>
            </ToastContext.Provider>
          )
        }}
      </Transition>
    )
  }
)

Toast.displayName = 'Toast'
