import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type NavbarBrandOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `span`, or `a` when `href` is set.
   */
  component?: C
  /**
   * The href attribute specifies the URL of the page the link goes to. Defaults `component` to
   * `a`.
   */
  href?: string
}

export type NavbarBrandProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  NavbarBrandOwnProps<C>
>

type NavbarBrandComponent = (<C extends ElementType = 'span'>(
  props: NavbarBrandProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NavbarBrandRender<C extends ElementType = 'span'>(
  { children, component, className, href, ...rest }: NavbarBrandProps<C>,
  ref: PolymorphicRef<C>
) {
  // Only defaults to `a` when `component` wasn't explicitly passed — an explicit `component`
  // (even alongside `href`) always wins.
  const Component = (component ?? (href ? 'a' : 'span')) as ElementType
  const _className = classNames('navbar-brand', className)

  return (
    <Component className={_className} href={href} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const NavbarBrand = createPolymorphicComponent<NavbarBrandComponent>(
  NavbarBrandRender as ForwardRefRenderFunction<Element, NavbarBrandProps<ElementType>>,
  'NavbarBrand'
)
