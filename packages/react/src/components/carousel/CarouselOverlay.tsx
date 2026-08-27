import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CarouselOverlayOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CarouselOverlayProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CarouselOverlayOwnProps<C>
>

type CarouselOverlayComponent = (<C extends ElementType = 'div'>(
  props: CarouselOverlayProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

/**
 * Overlays its children (typically controls and indicators) on top of the slides instead of
 * stacking them in the flow.
 */
function CarouselOverlayRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: CarouselOverlayProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('carousel-overlay', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CarouselOverlay = createPolymorphicComponent<CarouselOverlayComponent>(
  CarouselOverlayRender as ForwardRefRenderFunction<Element, CarouselOverlayProps<ElementType>>,
  'CarouselOverlay'
)
