import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxNavbarTextProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxNavbarText = forwardRef<HTMLSpanElement, CxNavbarTextProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('navbar-text', className)

    return (
      <span className={_className} {...rest} ref={ref}>
        {children}
      </span>
    )
  },
)

CxNavbarText.displayName = 'CxNavbarText'
