import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardImageOverlayOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CardImageOverlayProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CardImageOverlayOwnProps<C>
>

type CardImageOverlayComponent = (<C extends ElementType = 'div'>(
  props: CardImageOverlayProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardImageOverlayRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: CardImageOverlayProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('card-overlay', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardImageOverlay = createPolymorphicComponent<CardImageOverlayComponent>(
  CardImageOverlayRender as ForwardRefRenderFunction<Element, CardImageOverlayProps<ElementType>>,
  'CardImageOverlay'
)
