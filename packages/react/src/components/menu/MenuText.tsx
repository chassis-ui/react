import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type MenuTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type MenuTextProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  MenuTextOwnProps<C>
>

type MenuTextComponent = (<C extends ElementType = 'span'>(
  props: MenuTextProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function MenuTextRender<C extends ElementType = 'span'>(
  { children, className, component, ...rest }: MenuTextProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'span'
  const _className = classNames('menu-text', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const MenuText = createPolymorphicComponent<MenuTextComponent>(
  MenuTextRender as ForwardRefRenderFunction<Element, MenuTextProps<ElementType>>,
  'MenuText'
)
