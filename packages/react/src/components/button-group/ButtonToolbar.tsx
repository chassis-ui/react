import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ButtonToolbarOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type ButtonToolbarProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ButtonToolbarOwnProps<C>
>

type ButtonToolbarComponent = (<C extends ElementType = 'div'>(
  props: ButtonToolbarProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ButtonToolbarRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: ButtonToolbarProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('button-toolbar', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ButtonToolbar = createPolymorphicComponent<ButtonToolbarComponent>(
  ButtonToolbarRender as ForwardRefRenderFunction<Element, ButtonToolbarProps<ElementType>>,
  'ButtonToolbar'
)
