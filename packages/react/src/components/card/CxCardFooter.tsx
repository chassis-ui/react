import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxCardFooter = forwardRef<HTMLDivElement, CxCardFooterProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-footer', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxCardFooter.displayName = 'CxCardFooter'
