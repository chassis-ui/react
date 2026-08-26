import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { useCarouselContext } from './context'

export interface CarouselIndicatorsProps extends HTMLAttributes<HTMLOListElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Accessible label for each indicator button. Receives the slide's 1-based position.
   */
  label?: (position: number) => string
}

export const CarouselIndicators = forwardRef<HTMLOListElement, CarouselIndicatorsProps>(
  ({ className, label = (position) => `Slide ${position}`, ...rest }, ref) => {
    const { activeIndex, itemCount, itemsVisible, to } = useCarouselContext()
    const _className = classNames('carousel-indicators', className)
    // One indicator per reachable position, not per item — mirrors `navigate()`'s own clamping so
    // an indicator never targets an index the carousel can't actually land on (e.g. with
    // `items > 1`, the last few slides only ever appear alongside an earlier one).
    const indicatorCount = itemCount === 0 ? 0 : Math.max(1, itemCount - itemsVisible + 1)

    return (
      <ol className={_className} {...rest} ref={ref}>
        {Array.from({ length: indicatorCount }, (_, index) => index).map((index) => (
          <li key={index}>
            <button
              type="button"
              className={index === activeIndex ? 'active' : undefined}
              aria-current={index === activeIndex ? 'true' : undefined}
              aria-label={label(index + 1)}
              onClick={() => to(index)}
            />
          </li>
        ))}
      </ol>
    )
  }
)

CarouselIndicators.displayName = 'CarouselIndicators'
