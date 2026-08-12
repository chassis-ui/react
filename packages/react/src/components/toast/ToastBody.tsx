import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { CloseButton } from '../close-button/CloseButton'
import { useToast } from '../../hooks'

export interface ToastBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Adds a close button alongside the body content, so a toast composed without a
   * `ToastHeader` still gets a dismiss control without any manual layout markup.
   */
  closeButton?: boolean
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string
}

export const ToastBody = forwardRef<HTMLDivElement, ToastBodyProps>(
  ({ children, className, closeButton, closeLabel, ...rest }, ref) => {
    const { close } = useToast()
    const _className = classNames(
      'toast-body',
      { 'd-flex align-items-start justify-content-between gap-small': closeButton },
      className
    )
    return (
      <div className={_className} {...rest} ref={ref}>
        {closeButton ? <div>{children}</div> : children}
        {closeButton && <CloseButton label={closeLabel} onClick={close} />}
      </div>
    )
  }
)

ToastBody.displayName = 'ToastBody'
