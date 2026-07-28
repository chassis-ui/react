import React, {
  createContext,
  forwardRef,
  HTMLAttributes,
  useEffect,
  useRef,
  useState
} from 'react'
import { Transition } from 'react-transition-group'
import classNames from 'classnames'

import { ContextColor } from '../Types'
import { useForkedRef } from '../../hooks'

export interface CxToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
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
   * Sets the context color of the component to one of Chassis themed colors.
   */
  context?: ContextColor
  /**
   * Delay hiding the toast (ms).
   */
  delay?: number
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
  /**
   * Apply a full-color background with inverted text. Only meaningful alongside `context`.
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

interface ContextProps extends CxToastProps {
  visible?: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const CxToastContext = createContext({} as ContextProps)

export const CxToast = forwardRef<HTMLDivElement, CxToastProps>(
  (
    {
      children,
      animation = true,
      autohide = true,
      className,
      context,
      delay = 5000,
      role = 'status',
      solid,
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

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const contextValues = {
      visible: _visible,
      setVisible
    }

    // triggered on mount and destroy
    useEffect(() => () => _clearAutohideTimeout(), [])

    useEffect(() => {
      _maybeScheduleHide()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_visible])

    const _clearAutohideTimeout = () => {
      clearTimeout(timeout.current)
      timeout.current = undefined
    }

    // The autohide timer only starts once neither the pointer nor focus is
    // interacting with the toast, mirroring Chassis CSS's toast.js behavior.
    const _maybeScheduleHide = () => {
      if (!autohide || hasMouseInteraction.current || hasKeyboardInteraction.current) {
        return
      }
      _clearAutohideTimeout()
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
        context: !!context,
        solid: Boolean(solid && context),
        translucent
      },
      context,
      className
    )

    const getTransitionClass = (state: string) => {
      return state === 'entering'
        ? 'showing'
        : state === 'entered'
          ? 'show'
          : state === 'exiting'
            ? 'showing'
            : 'fade'
    }

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
            <CxToastContext.Provider value={contextValues}>
              <div
                className={classNames(_className, transitionClass)}
                role={role}
                onMouseEnter={_onMouseEnter}
                onMouseLeave={_onMouseLeave}
                onFocus={_onFocus}
                onBlur={_onBlur}
                {...rest}
                ref={forkedRef}
              >
                {children}
              </div>
            </CxToastContext.Provider>
          )
        }}
      </Transition>
    )
  }
)

CxToast.displayName = 'CxToast'
