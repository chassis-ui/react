import React, { ButtonHTMLAttributes, forwardRef } from 'react'

import { IconValue } from '../../utils/iconConfig'
import { CarouselControlButton } from './CarouselControlButton'

export interface CarouselControlPrevProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The control's icon: an icon name, or an element of your own icon set. Defaults to
   * `IconProvider`'s `previous` icon.
   */
  icon?: IconValue
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
