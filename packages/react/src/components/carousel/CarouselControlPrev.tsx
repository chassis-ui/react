import React, { ButtonHTMLAttributes, forwardRef } from 'react'

import { CarouselControlButton } from './CarouselControlButton'

export interface CarouselControlPrevProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The accessible label announced by assistive technology.
   */
  label?: string
}

export const CarouselControlPrev = forwardRef<HTMLButtonElement, CarouselControlPrevProps>(
  ({ label = 'Previous slide', ...rest }, ref) => (
    <CarouselControlButton {...rest} direction="prev" label={label} ref={ref} />
  )
)

CarouselControlPrev.displayName = 'CarouselControlPrev'
