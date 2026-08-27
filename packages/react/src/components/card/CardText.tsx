import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CardTextProps<C extends ElementType = 'p'> = PolymorphicComponentProps<
  C,
  CardTextOwnProps<C>
>

type CardTextComponent = (<C extends ElementType = 'p'>(
  props: CardTextProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardTextRender<C extends ElementType = 'p'>(
  { children, component, className, ...rest }: CardTextProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'p'
  const _className = classNames('card-text', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardText = createPolymorphicComponent<CardTextComponent>(
  CardTextRender as ForwardRefRenderFunction<Element, CardTextProps<ElementType>>,
  'CardText'
)
