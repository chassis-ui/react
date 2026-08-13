import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CarouselOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

/**
 * Overlays its children (typically controls and indicators) on top of the slides instead of
 * stacking them in the flow.
 */
export const CarouselOverlay = forwardRef<HTMLDivElement, CarouselOverlayProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('carousel-overlay', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

CarouselOverlay.displayName = 'CarouselOverlay'
