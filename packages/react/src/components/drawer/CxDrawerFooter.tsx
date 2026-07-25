import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxDrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Stack the footer actions as full-width columns instead of a right-aligned row.
   */
  stacked?: boolean
}

export const CxDrawerFooter = forwardRef<HTMLDivElement, CxDrawerFooterProps>(
  ({ children, className, stacked, ...rest }, ref) => {
    const _className = classNames('drawer-footer', { stacked }, className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxDrawerFooter.displayName = 'CxDrawerFooter'
