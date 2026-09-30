import React, { ElementType, ForwardRefRenderFunction, isValidElement, ReactElement } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { useCarouselContext } from './context'
import { readSlides, SlidePositionContext } from './slides'

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
  const { nodes, positioned } = readSlides(children)

  // Every child is wrapped the same way whether or not the positions are known, so a child that
  // comes and goes (a loading spinner beside the slides) doesn't remount the slides. Unknown
  // positions are provided as unset, which also keeps an enclosing carousel's from leaking in.
  return (
    <Component className={_className} {...rest} ref={forkedRef}>
      {nodes.map((node, index) => (
        <SlidePositionContext.Provider
          key={isValidElement(node) ? node.key : index}
          value={positioned ? { count: nodes.length, index } : undefined}
        >
          {node}
        </SlidePositionContext.Provider>
      ))}
    </Component>
  )
}

export const CarouselInner = createPolymorphicComponent<CarouselInnerComponent>(
  CarouselInnerRender as ForwardRefRenderFunction<Element, CarouselInnerProps<ElementType>>,
  'CarouselInner'
)
