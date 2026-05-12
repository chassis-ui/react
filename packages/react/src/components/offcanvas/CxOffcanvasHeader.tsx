import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface COffcanvasHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxOffcanvasHeader = forwardRef<HTMLDivElement, COffcanvasHeaderProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('offcanvas-header', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxOffcanvasHeader.displayName = 'CxOffcanvasHeader'
