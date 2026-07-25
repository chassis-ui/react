import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { CxToastClose } from './CxToastClose'

export interface CxToastHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Automatically add a close button to the header.
   */
  closeButton?: boolean
}

export const CxToastHeader = forwardRef<HTMLDivElement, CxToastHeaderProps>(
  ({ children, className, closeButton, ...rest }, ref) => {
    const _className = classNames('toast-header', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CxToastClose />}
      </div>
    )
  },
)

CxToastHeader.displayName = 'CxToastHeader'
