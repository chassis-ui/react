import React, { ElementType, ForwardRefRenderFunction, ReactElement, useContext } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { CarouselContext } from './context'
import { SlidePositionContext } from './slides'

type CarouselItemOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Milliseconds to wait before autoplay advances past this slide, overriding the carousel's own `interval`.
   */
  interval?: number
}

export type CarouselItemProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CarouselItemOwnProps<C>
>

type CarouselItemComponent = (<C extends ElementType = 'div'>(
  props: CarouselItemProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CarouselItemRender<C extends ElementType = 'div'>(
  { children, className, component, interval, ...rest }: CarouselItemProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  // Where this slide sits, when `CarouselInner` can tell (see `slides.tsx`), so the first render,
  // the server's too, marks the active slide. `Carousel` applies the same from the DOM otherwise.
  const carousel = useContext(CarouselContext)
  const slide = useContext(SlidePositionContext)
  const position =
    carousel && slide
      ? {
          'aria-label': `${slide.index + 1} of ${slide.count}`,
          'aria-roledescription': 'slide',
          role: 'group'
        }
      : {}
  const _className = classNames(
    'carousel-item',
    { active: !!carousel && !!slide && slide.index === carousel.activeIndex },
    className
  )

  return (
    <Component className={_className} data-interval={interval} {...position} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CarouselItem = createPolymorphicComponent<CarouselItemComponent>(
  CarouselItemRender as ForwardRefRenderFunction<Element, CarouselItemProps<ElementType>>,
  'CarouselItem'
)
