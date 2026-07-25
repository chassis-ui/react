import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxCardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxCardBody = forwardRef<HTMLDivElement, CxCardBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-body', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxCardBody.displayName = 'CxCardBody'
