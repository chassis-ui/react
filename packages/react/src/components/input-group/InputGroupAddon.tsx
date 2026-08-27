import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type InputGroupAddonOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * The id of the form control this addon labels, when rendered as `component="label"`.
   */
  htmlFor?: string
}

export type InputGroupAddonProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  InputGroupAddonOwnProps<C>
>

type InputGroupAddonComponent = (<C extends ElementType = 'span'>(
  props: InputGroupAddonProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function InputGroupAddonRender<C extends ElementType = 'span'>(
  { children, className, component, ...rest }: InputGroupAddonProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'span'
  const _className = classNames('input-addon', className)
  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const InputGroupAddon = createPolymorphicComponent<InputGroupAddonComponent>(
  InputGroupAddonRender as ForwardRefRenderFunction<Element, InputGroupAddonProps<ElementType>>,
  'InputGroupAddon'
)
