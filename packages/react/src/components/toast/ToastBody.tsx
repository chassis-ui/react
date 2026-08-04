import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface ToastBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const ToastBody = forwardRef<HTMLDivElement, ToastBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('toast-body', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

ToastBody.displayName = 'ToastBody'
