import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { Breakpoint } from '../../types'

type ContainerOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Set container 100% wide until the given breakpoint, after which it scales up with `max-width`
   * at every larger breakpoint.
   *
   * @type Breakpoint
   */
  fluidUntil?: Breakpoint
  /**
   * Set container 100% wide, spanning the entire width of the viewport.
   */
  fluid?: boolean
}

export type ContainerProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ContainerOwnProps<C>
>

type ContainerComponent = (<C extends ElementType = 'div'>(
  props: ContainerProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ContainerRender<C extends ElementType = 'div'>(
  { children, className, component, fluidUntil, fluid, ...rest }: ContainerProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('container', fluid && 'fluid', fluidUntil, className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const Container = createPolymorphicComponent<ContainerComponent>(
  ContainerRender as ForwardRefRenderFunction<Element, ContainerProps<ElementType>>,
  'Container'
)
