import React, { forwardRef, HTMLAttributes } from 'react'

export interface NavTitleProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const NavTitle = forwardRef<HTMLLIElement, NavTitleProps>(
  ({ children, className, ...rest }, ref) => {
    // chassis-css has no rule for a nav title, so it takes no class of its own: the caller's
    // `className` styles it.
    return (
      <li className={className} {...rest} ref={ref}>
        {children}
      </li>
    )
  }
)

NavTitle.displayName = 'NavTitle'
