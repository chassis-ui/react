import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CInputGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
}

export const CxInputGroup = forwardRef<HTMLDivElement, CInputGroupProps>(
  ({ children, className, size, ...rest }, ref) => {
    const _className = classNames('input-group', size, className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxInputGroup.displayName = 'CxInputGroup'
