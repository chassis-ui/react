import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { hrefProps, linkElement, resolveLinkKind } from '../../utils/elementKind'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef,
  PolymorphicRefWithFallback
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
  props: NavbarBrandProps<C> & {
    ref?: PolymorphicRefWithFallback<C, HTMLSpanElement | HTMLAnchorElement>
  }
) => ReactElement | null) & { displayName?: string }

function NavbarBrandRender<C extends ElementType = 'span'>(
  { children, component, className, href, ...rest }: NavbarBrandProps<C>,
  ref: PolymorphicRef<C>
) {
  // `href` makes it an `<a>`, unless `component` or `asChild` chose the element (see
  // `linkElement`).
  const Component = linkElement(component, href, 'span')
  const _className = classNames('navbar-brand', className)

  return (
    <Component
      className={_className}
      {...hrefProps(resolveLinkKind(Component, href, rest), href, 'NavbarBrand')}
      {...rest}
      ref={ref}
    >
      {children}
    </Component>
  )
}

export const NavbarBrand = createPolymorphicComponent<NavbarBrandComponent>(
  NavbarBrandRender as ForwardRefRenderFunction<Element, NavbarBrandProps<ElementType>>,
  'NavbarBrand'
)
