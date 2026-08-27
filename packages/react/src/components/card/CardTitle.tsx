import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CardTitleProps<C extends ElementType = 'h5'> = PolymorphicComponentProps<
  C,
  CardTitleOwnProps<C>
>

type CardTitleComponent = (<C extends ElementType = 'h5'>(
  props: CardTitleProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardTitleRender<C extends ElementType = 'h5'>(
  { children, component, className, ...rest }: CardTitleProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'h5'
  const _className = classNames('card-title', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardTitle = createPolymorphicComponent<CardTitleComponent>(
  CardTitleRender as ForwardRefRenderFunction<Element, CardTitleProps<ElementType>>,
  'CardTitle'
)
