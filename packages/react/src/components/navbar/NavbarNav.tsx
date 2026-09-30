import React, { ElementType, ForwardRefRenderFunction, ReactElement, useContext } from 'react'
import classNames from 'classnames'

import { resolveElementTag } from '../../utils/elementKind'
import { NavOverflowContext, NavOverflowItems } from '../../utils/navOverflow'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type NavbarNavOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type NavbarNavProps<C extends ElementType = 'ul'> = PolymorphicComponentProps<
  C,
  NavbarNavOwnProps<C>
>

type NavbarNavComponent = (<C extends ElementType = 'ul'>(
  props: NavbarNavProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NavbarNavRender<C extends ElementType = 'ul'>(
  { children, component, className, ...rest }: NavbarNavProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'ul'
  // Inside a `NavOverflow` the list is also a `.nav`, which is what chassis-css keeps on one line
  // there (`.nav-overflow > .nav`).
  const overflows = useContext(NavOverflowContext) !== null
  const _className = classNames({ nav: overflows }, 'navbar-nav', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      <NavOverflowItems tag={resolveElementTag(Component)}>{children}</NavOverflowItems>
    </Component>
  )
}

export const NavbarNav = createPolymorphicComponent<NavbarNavComponent>(
  NavbarNavRender as ForwardRefRenderFunction<Element, NavbarNavProps<ElementType>>,
  'NavbarNav'
)
