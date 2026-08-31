import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardSubtitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CardSubtitleProps<C extends ElementType = 'h6'> = PolymorphicComponentProps<
  C,
  CardSubtitleOwnProps<C>
>

type CardSubtitleComponent = (<C extends ElementType = 'h6'>(
  props: CardSubtitleProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardSubtitleRender<C extends ElementType = 'h6'>(
  { children, component, className, ...rest }: CardSubtitleProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'h6'
  const _className = classNames('card-subtitle', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardSubtitle = createPolymorphicComponent<CardSubtitleComponent>(
  CardSubtitleRender as ForwardRefRenderFunction<Element, CardSubtitleProps<ElementType>>,
  'CardSubtitle'
)
