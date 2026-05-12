import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CFormFloatingProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const CxFormFloating = forwardRef<HTMLDivElement, CFormFloatingProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('form-floating', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxFormFloating.displayName = 'CxFormFloating'
