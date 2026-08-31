import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CardFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CardFooterOwnProps<C>
>

type CardFooterComponent = (<C extends ElementType = 'div'>(
  props: CardFooterProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardFooterRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: CardFooterProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('card-footer', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardFooter = createPolymorphicComponent<CardFooterComponent>(
  CardFooterRender as ForwardRefRenderFunction<Element, CardFooterProps<ElementType>>,
  'CardFooter'
)
