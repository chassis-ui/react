import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { Responsive } from '../../types'
import { baseValue, responsiveClassNames, responsiveProp } from '../../utils/breakpoints'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardImageOrientation = 'top' | 'bottom' | 'start' | 'end'

type CardImageOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component —
   * e.g. a framework's own `Image` component. Its own props (`src`, `fill`, `priority`, etc.)
   * are type-checked at the call site once passed here.
   */
  component?: C
  /**
   * Orientates the image to the top or bottom of the card as an "image cap", or to the start/end
   * for a horizontal layout. Omit to round all four corners for use inside `CardBody`. An object
   * sets the orientation from a breakpoint up — e.g. `{ base: 'top', lg: 'start' }` to switch an
   * image cap from `top` to `start` once the card lays out horizontally.
   */
  orientation?: Responsive<CardImageOrientation>
}

export type CardImageProps<C extends ElementType = 'img'> = PolymorphicComponentProps<
  C,
  CardImageOwnProps<C>
>

type CardImageComponent = (<C extends ElementType = 'img'>(
  props: CardImageProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

const orientationClassName = (orientation: CardImageOrientation, prefix: string) =>
  `${prefix}card-image-${orientation}`

function CardImageRender<C extends ElementType = 'img'>(
  { children, className, component, orientation, ...rest }: CardImageProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'img'
  const _className = classNames(
    // With no orientation at the base, the image is the plain one of `CardBody`.
    baseValue(orientation) === undefined && 'card-image',
    responsiveClassNames([responsiveProp(orientation, orientationClassName)]),
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardImage = createPolymorphicComponent<CardImageComponent>(
  CardImageRender as ForwardRefRenderFunction<Element, CardImageProps<ElementType>>,
  'CardImage'
)
