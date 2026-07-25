import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Stack the footer actions as full-width columns instead of a right-aligned row.
   */
  stacked?: boolean
}

export const CxModalFooter = forwardRef<HTMLDivElement, CxModalFooterProps>(
  ({ children, className, stacked, ...rest }, ref) => {
    const _className = classNames('modal-footer', { stacked }, className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxModalFooter.displayName = 'CxModalFooter'
