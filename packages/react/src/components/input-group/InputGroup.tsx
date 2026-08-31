import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type InputGroupOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
}

export type InputGroupProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  InputGroupOwnProps<C>
>

type InputGroupComponent = (<C extends ElementType = 'div'>(
  props: InputGroupProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function InputGroupRender<C extends ElementType = 'div'>(
  { children, className, component, size, ...rest }: InputGroupProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('input-group', size, className)
  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const InputGroup = createPolymorphicComponent<InputGroupComponent>(
  InputGroupRender as ForwardRefRenderFunction<Element, InputGroupProps<ElementType>>,
  'InputGroup'
)
