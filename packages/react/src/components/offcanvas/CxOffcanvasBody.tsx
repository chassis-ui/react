import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface COffcanvasBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxOffcanvasBody = forwardRef<HTMLDivElement, COffcanvasBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('offcanvas-body', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxOffcanvasBody.displayName = 'CxOffcanvasBody'
