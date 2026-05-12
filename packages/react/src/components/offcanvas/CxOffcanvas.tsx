import React, { forwardRef, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import classNames from 'classnames'

import { useForkedRef } from '../../utils/hooks'
import { CxBackdrop } from '../backdrop/CxBackdrop'

export interface COffcanvasProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Apply a backdrop on body while offcanvas is open.
   */
  backdrop?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Closes the offcanvas when escape key is pressed [docs]
   */
  keyboard?: boolean
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void
  /**
   * Components placement, there’s no default placement.
   */
  placement: 'start' | 'end' | 'top' | 'bottom'
  /**
   * Generates modal using createPortal.
   */
  portal?: boolean
  /**
   * Allow body scrolling while offcanvas is open
   */
  scroll?: boolean
  /**
   * Toggle the visibility of offcanvas component.
   */
  visible?: boolean
}

export const CxOffcanvas = forwardRef<HTMLDivElement, COffcanvasProps>(
  (
    {
      children,
      backdrop = true,
      className,
      keyboard = true,
      onHide,
      onShow,
      placement,
      portal = true,
      scroll = false,
      visible = false,
      ...rest
    },
    ref,
  ) => {
    const [_visible, setVisible] = useState<boolean>(visible)
    const offcanvasRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, offcanvasRef)

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    useEffect(() => {
      if (_visible) {
        if (!scroll) {
          document.body.style.overflow = 'hidden'
          document.body.style.paddingRight = '0px'
        }
        return
      }

      if (!scroll) {
        document.body.style.removeProperty('overflow')
        document.body.style.removeProperty('padding-right')
      }
    }, [_visible])

    const _className = classNames(
      'offcanvas',
      {
        [`offcanvas-${placement}`]: placement,
        show: _visible,
      },
      className,
    )

    const transitionStyles = {
      entering: { visibility: 'visible' },
      entered: { visibility: 'visible' },
      exiting: { visibility: 'visible' },
      exited: { visibility: 'hidden' },
    }

    const handleDismiss = () => {
      setVisible(false)
    }

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' && keyboard) {
          return handleDismiss()
        }
      },
      [ref, handleDismiss],
    )

    const offcanvas = (ref: React.Ref<HTMLDivElement>, state: string) => {
      return (
        <>
          <div
            className={_className}
            role="dialog"
            aria-modal="true"
            style={{ ...(transitionStyles as Record<string, React.CSSProperties>)[state] }}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            {...rest}
            ref={ref}
          >
            {children}
          </div>
        </>
      )
    }

    return (
      <>
        <Transition
          in={_visible}
          onEnter={onShow}
          onEntered={() => offcanvasRef.current?.focus()}
          onExit={onHide}
          timeout={300}
        >
          {(state) => {
            return typeof window !== 'undefined' && portal
              ? createPortal(offcanvas(forkedRef, state), document.body)
              : offcanvas(forkedRef, state)
          }}
        </Transition>
        {typeof window !== 'undefined' && portal
          ? backdrop &&
            createPortal(
              <CxBackdrop
                className="offcanvas-backdrop"
                onClick={handleDismiss}
                visible={_visible}
              />,
              document.body,
            )
          : backdrop && (
              <CxBackdrop
                className="offcanvas-backdrop"
                onClick={handleDismiss}
                visible={_visible}
              />
            )}
      </>
    )
  },
)

CxOffcanvas.displayName = 'CxOffcanvas'
