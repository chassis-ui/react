import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Milliseconds to wait before autoplay advances past this slide, overriding the carousel's own `interval`.
   */
  interval?: number
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ children, className, interval, ...rest }, ref) => {
    const _className = classNames('carousel-item', className)

    return (
      <div className={_className} data-interval={interval} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

CarouselItem.displayName = 'CarouselItem'
