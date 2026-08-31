import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type NavbarTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type NavbarTextProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  NavbarTextOwnProps<C>
>

type NavbarTextComponent = (<C extends ElementType = 'span'>(
  props: NavbarTextProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NavbarTextRender<C extends ElementType = 'span'>(
  { children, className, component, ...rest }: NavbarTextProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'span'
  const _className = classNames('navbar-text', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const NavbarText = createPolymorphicComponent<NavbarTextComponent>(
  NavbarTextRender as ForwardRefRenderFunction<Element, NavbarTextProps<ElementType>>,
  'NavbarText'
)
