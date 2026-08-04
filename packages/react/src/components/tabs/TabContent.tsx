import React, { HTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

export interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('tab-content', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

TabContent.displayName = 'TabContent'
