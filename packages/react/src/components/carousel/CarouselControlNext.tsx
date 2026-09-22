import React, { ButtonHTMLAttributes, forwardRef } from 'react'

import { IconValue } from '../../utils/iconConfig'
import { CarouselControlButton } from './CarouselControlButton'

export interface CarouselControlNextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The control's icon: an icon name, or an element of your own icon set. Defaults to
   * `IconProvider`'s `next` icon.
   */
  icon?: IconValue
  /**
   * The accessible label announced by assistive technology.
   */
  label?: string
}

export const CarouselControlNext = forwardRef<HTMLButtonElement, CarouselControlNextProps>(
  ({ label = 'Next slide', ...rest }, ref) => (
    <CarouselControlButton {...rest} direction="next" label={label} ref={ref} />
  )
)

CarouselControlNext.displayName = 'CarouselControlNext'
