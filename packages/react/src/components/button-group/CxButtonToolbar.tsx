import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CButtonToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxButtonToolbar = forwardRef<HTMLDivElement, CButtonToolbarProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('button-toolbar', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxButtonToolbar.displayName = 'CxButtonToolbar'
