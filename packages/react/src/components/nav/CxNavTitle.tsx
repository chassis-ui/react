import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxNavTitleProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const CxNavTitle = forwardRef<HTMLLIElement, CxNavTitleProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('nav-title', className)
    return (
      <li className={_className} {...rest} ref={ref}>
        {children}
      </li>
    )
  },
)

CxNavTitle.displayName = 'CxNavTitle'
