import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CarouselCaptionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CarouselCaption = forwardRef<HTMLDivElement, CarouselCaptionProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('carousel-caption', className)

    return <div className={_className} {...rest} ref={ref} />
  }
)

CarouselCaption.displayName = 'CarouselCaption'
