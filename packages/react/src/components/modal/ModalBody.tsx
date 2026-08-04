import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('modal-body', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

ModalBody.displayName = 'ModalBody'
