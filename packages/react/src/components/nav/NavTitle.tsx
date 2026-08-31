import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface NavTitleProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const NavTitle = forwardRef<HTMLLIElement, NavTitleProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('nav-title', className)
    return (
      <li className={_className} {...rest} ref={ref}>
        {children}
      </li>
    )
  }
)

NavTitle.displayName = 'NavTitle'
