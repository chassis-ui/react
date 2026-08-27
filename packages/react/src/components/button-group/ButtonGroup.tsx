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
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Create a set of buttons that appear vertically stacked rather than horizontally. Split button dropdowns are not supported here.
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
  const _className = classNames('button-group', { vertical }, size, className)

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
