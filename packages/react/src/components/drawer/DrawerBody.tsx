import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('drawer-body', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

DrawerBody.displayName = 'DrawerBody'
