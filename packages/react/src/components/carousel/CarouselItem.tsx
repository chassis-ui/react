import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

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
  const _className = classNames('carousel-item', className)

  return (
    <Component className={_className} data-interval={interval} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CarouselItem = createPolymorphicComponent<CarouselItemComponent>(
  CarouselItemRender as ForwardRefRenderFunction<Element, CarouselItemProps<ElementType>>,
  'CarouselItem'
)
