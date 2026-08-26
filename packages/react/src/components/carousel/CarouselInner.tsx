import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { useCarouselContext } from './context'

export interface CarouselInnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

/**
 * The scroll viewport — a real horizontally-scrolling container using CSS scroll-snap. Wrap
 * CarouselItem children in this rather than passing them directly to Carousel, so controls and
 * indicators can sit alongside it (above, below, or overlaid) instead of inside the scroll track.
 */
export const CarouselInner = forwardRef<HTMLDivElement, CarouselInnerProps>(
  ({ children, className, ...rest }, ref) => {
    const { registerViewport } = useCarouselContext()
    const forkedRef = useForkedRef(ref, registerViewport)
    const _className = classNames('carousel-inner', className)

    return (
      <div className={_className} {...rest} ref={forkedRef}>
        {children}
      </div>
    )
  }
)

CarouselInner.displayName = 'CarouselInner'
