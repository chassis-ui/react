import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CModalContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxModalContent = forwardRef<HTMLDivElement, CModalContentProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('modal-content', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxModalContent.displayName = 'CxModalContent'
