import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxModalBody = forwardRef<HTMLDivElement, CxModalBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('modal-body', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxModalBody.displayName = 'CxModalBody'
