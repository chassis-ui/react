import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxCardGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxCardGroup = forwardRef<HTMLDivElement, CxCardGroupProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-group', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxCardGroup.displayName = 'CxCardGroup'
