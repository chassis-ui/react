import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Create a set of buttons that appear vertically stacked rather than horizontally. Split button dropdowns are not supported here.
   */
  vertical?: boolean
}

export const CxButtonGroup = forwardRef<HTMLDivElement, CButtonGroupProps>(
  ({ children, className, size, vertical, ...rest }, ref) => {
    const _className = classNames(
      'button-group',
      vertical,
      size,
      className,
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxButtonGroup.displayName = 'CxButtonGroup'
