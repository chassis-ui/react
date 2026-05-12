import React, {
  createContext,
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { Transition } from 'react-transition-group'

import { useForkedRef } from '../../utils/hooks'

import { CxBackdrop } from '../backdrop/CxBackdrop'
import { CxModalContent } from './CxModalContent'
import { CxModalDialog } from './CxModalDialog'

export interface CModalProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Align the modal in the center or top of the screen.
   */
  alignment?: 'top' | 'center'
  /**
   * Apply a backdrop on body while modal is open.
   */
  backdrop?: boolean | 'static'
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * @ignore
   */
  duration?: number
  /**
   * Set modal to covers the entire user viewport.
   */
  fullscreen?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * Closes the modal when escape key is pressed.
   */
  keyboard?: boolean
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: () => void
  /**
   * Callback fired when the component requests to be closed.
   */
  onClosePrevented?: () => void
  /**
   * Callback fired when the modal is shown, its backdrop is static and a click outside the modal or an escape key press is performed with the keyboard option set to false.
   */
  onShow?: () => void
  /**
   * Generates modal using createPortal.
   */
  portal?: boolean
  /**
   * Create a scrollable modal that allows scrolling the modal body.
   */
  scrollable?: boolean
  /**
   * Size the component small, large, or extra large.
   */
  size?: 'small' | 'large' | 'xlarge'
  /**
   * Remove animation to create modal that simply appear rather than fade in to view.
   */
  transition?: boolean
  /**
   * Toggle the visibility of modal component.
   */
  visible?: boolean
}

interface ModalContextProps {
  visible?: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export const CModalContext = createContext({} as ModalContextProps)

export const CxModal = forwardRef<HTMLDivElement, CModalProps>(
  (
    {
      children,
      alignment,
      backdrop = true,
      className,
      duration = 150,
      fullscreen,
      keyboard = true,
      onClose,
      onClosePrevented,
      onShow,
      portal = true,
      scrollable,
      size,
      transition = true,
      visible,
    },
    ref,
  ) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, modalRef)

    const [_visible, setVisible] = useState(visible)
    const [staticBackdrop, setStaticBackdrop] = useState(false)

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const contextValues = {
      visible: _visible,
      setVisible,
    }

    const handleDismiss = () => {
      if (backdrop === 'static') {
        return setStaticBackdrop(true)
      }
      return onClose && onClose()
    }

    useLayoutEffect(() => {
      onClosePrevented && onClosePrevented()
      setTimeout(() => setStaticBackdrop(false), duration)
    }, [staticBackdrop])

    const getTransitionClass = (state: string) => {
      return state === 'entering'
        ? 'd-block'
        : state === 'entered'
        ? 'show d-block'
        : state === 'exiting'
        ? 'd-block'
        : ''
    }
    const _className = classNames(
      'modal',
      {
        'modal-static': staticBackdrop,
        fade: transition,
      },
      className,
    )

    // Set focus to modal after open
    useLayoutEffect(() => {
      if (_visible) {
        document.body.classList.add('modal-open')
        setTimeout(
          () => {
            modalRef.current?.focus()
          },
          !transition ? 0 : duration,
        )
      } else {
        document.body.classList.remove('modal-open')
      }
      return () => document.body.classList.remove('modal-open')
    }, [_visible])

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' && keyboard) {
          return handleDismiss()
        }
      },
      [modalRef, handleDismiss],
    )

    const modal = (ref?: React.Ref<HTMLDivElement>, transitionClass?: string) => {
      return (
        <CModalContext.Provider value={contextValues}>
          <div
            className={classNames(_className, transitionClass)}
            tabIndex={-1}
            role="dialog"
            ref={ref}
          >
            <CxModalDialog
              alignment={alignment}
              fullscreen={fullscreen}
              scrollable={scrollable}
              size={size}
              onClick={(event) => event.stopPropagation()}
            >
              <CxModalContent>{children}</CxModalContent>
            </CxModalDialog>
          </div>
        </CModalContext.Provider>
      )
    }

    return (
      <>
        <div onClick={handleDismiss} onKeyDown={handleKeyDown}>
          <Transition
            in={_visible}
            mountOnEnter
            onEnter={onShow}
            onExit={onClose}
            unmountOnExit
            timeout={!transition ? 0 : duration}
          >
            {(state) => {
              const transitionClass = getTransitionClass(state)
              return typeof window !== 'undefined' && portal
                ? createPortal(modal(forkedRef, transitionClass), document.body)
                : modal(forkedRef, transitionClass)
            }}
          </Transition>
        </div>
        {typeof window !== 'undefined' && portal
          ? backdrop && createPortal(<CxBackdrop visible={_visible} />, document.body)
          : backdrop && <CxBackdrop visible={_visible} />}
      </>
    )
  },
)

CxModal.displayName = 'CxModal'
