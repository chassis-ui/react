import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardGroupOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type CardGroupProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CardGroupOwnProps<C>
>

type CardGroupComponent = (<C extends ElementType = 'div'>(
  props: CardGroupProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

// Arranges direct-child Cards as an equal-width row, joined edge-to-edge, once its container
// reaches the small container breakpoint — below that, cards stack vertically. Requires a
// `.contains-inline` ancestor (not applied by CardGroup itself, e.g. a wrapping
// `<div className="contains-inline">`) to establish the container query context.
function CardGroupRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: CardGroupProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('card-group', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardGroup = createPolymorphicComponent<CardGroupComponent>(
  CardGroupRender as ForwardRefRenderFunction<Element, CardGroupProps<ElementType>>,
  'CardGroup'
)
