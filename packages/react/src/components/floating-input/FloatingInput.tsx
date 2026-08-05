import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface FloatingInputProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const FloatingInput = forwardRef<HTMLDivElement, FloatingInputProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('form-floating', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

FloatingInput.displayName = 'FloatingInput'
