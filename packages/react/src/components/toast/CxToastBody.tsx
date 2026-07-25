import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxToastBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxToastBody = forwardRef<HTMLDivElement, CxToastBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('toast-body', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxToastBody.displayName = 'CxToastBody'
