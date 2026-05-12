import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CCardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxCardBody = forwardRef<HTMLDivElement, CCardBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-content', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxCardBody.displayName = 'CxCardBody'
