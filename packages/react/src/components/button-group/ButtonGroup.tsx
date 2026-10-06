import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ButtonGroupOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * Create a set of buttons that appear vertically stacked rather than horizontally, with the
   * `.button-group-vertical` class in place of `.button-group`. Split button dropdowns are not
   * supported here, and `size` has no effect: chassis-css sizes the buttons of a horizontal group
   * only, so size the buttons of a vertical one themselves.
   */
  vertical?: boolean
}

export type ButtonGroupProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ButtonGroupOwnProps<C>
>

type ButtonGroupComponent = (<C extends ElementType = 'div'>(
  props: ButtonGroupProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ButtonGroupRender<C extends ElementType = 'div'>(
  { children, className, component, size, vertical, ...rest }: ButtonGroupProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  // chassis-css stacks a group with `.button-group-vertical` in place of `.button-group`: the two
  // share the base rules, and the horizontal ones (the overlap of the borders, the corners) hang
  // on `.button-group` alone.
  const _className = classNames(
    vertical ? 'button-group-vertical' : 'button-group',
    size,
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ButtonGroup = createPolymorphicComponent<ButtonGroupComponent>(
  ButtonGroupRender as ForwardRefRenderFunction<Element, ButtonGroupProps<ElementType>>,
  'ButtonGroup'
)
