import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxModalFooter = forwardRef<HTMLDivElement, CModalFooterProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('modal-footer', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxModalFooter.displayName = 'CxModalFooter'
