import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CardImageOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CardImageOverlay = forwardRef<HTMLDivElement, CardImageOverlayProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-overlay', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

CardImageOverlay.displayName = 'CardImageOverlay'
