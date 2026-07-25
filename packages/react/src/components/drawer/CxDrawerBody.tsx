import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxDrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxDrawerBody = forwardRef<HTMLDivElement, CxDrawerBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('drawer-body', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxDrawerBody.displayName = 'CxDrawerBody'
