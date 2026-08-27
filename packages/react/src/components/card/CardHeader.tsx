import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardHeaderOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CardHeaderProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CardHeaderOwnProps<C>
>

type CardHeaderComponent = (<C extends ElementType = 'div'>(
  props: CardHeaderProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardHeaderRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: CardHeaderProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('card-header', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardHeader = createPolymorphicComponent<CardHeaderComponent>(
  CardHeaderRender as ForwardRefRenderFunction<Element, CardHeaderProps<ElementType>>,
  'CardHeader'
)
