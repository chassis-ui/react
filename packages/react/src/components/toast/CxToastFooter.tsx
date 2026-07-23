import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CToastFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxToastFooter = forwardRef<HTMLDivElement, CToastFooterProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('toast-footer', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxToastFooter.displayName = 'CxToastFooter'
