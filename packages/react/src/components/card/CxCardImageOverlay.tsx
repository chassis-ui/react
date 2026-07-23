import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CCardImageOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxCardImageOverlay = forwardRef<HTMLDivElement, CCardImageOverlayProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-overlay', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxCardImageOverlay.displayName = 'CxCardImageOverlay'
