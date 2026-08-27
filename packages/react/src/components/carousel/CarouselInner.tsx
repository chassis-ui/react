import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { useCarouselContext } from './context'

type CarouselInnerOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CarouselInnerProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CarouselInnerOwnProps<C>
>

type CarouselInnerComponent = (<C extends ElementType = 'div'>(
  props: CarouselInnerProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

/**
 * The scroll viewport — a real horizontally-scrolling container using CSS scroll-snap. Wrap
 * CarouselItem children in this rather than passing them directly to Carousel, so controls and
 * indicators can sit alongside it (above, below, or overlaid) instead of inside the scroll track.
 */
function CarouselInnerRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: CarouselInnerProps<C>,
  ref: PolymorphicRef<C>
) {
  const { registerViewport } = useCarouselContext()
  const Component = component ?? 'div'
  const forkedRef = useForkedRef(ref, registerViewport)
  const _className = classNames('carousel-inner', className)

  return (
    <Component className={_className} {...rest} ref={forkedRef}>
      {children}
    </Component>
  )
}

export const CarouselInner = createPolymorphicComponent<CarouselInnerComponent>(
  CarouselInnerRender as ForwardRefRenderFunction<Element, CarouselInnerProps<ElementType>>,
  'CarouselInner'
)
