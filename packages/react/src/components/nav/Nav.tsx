import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { NavItem } from './NavItem'

export interface NavItemDef {
  /**
   * Label content for the nav item.
   */
  label: React.ReactNode
  /**
   * URL for the nav link.
   */
  href?: string
  /**
   * Marks the item as active.
   */
  active?: boolean
  /**
   * Marks the item as disabled.
   */
  disabled?: boolean
}

type NavOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Array of nav item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: NavItemDef[]
  /**
   * Specify a layout type for component.
   */
  layout?: 'fill' | 'justified'
  /**
   * Set the nav variant to tabs or pills.
   */
  variant?: 'tabs' | 'pills'
}

export type NavProps<C extends ElementType = 'ul'> = PolymorphicComponentProps<C, NavOwnProps<C>>

type NavComponent = (<C extends ElementType = 'ul'>(
  props: NavProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NavRender<C extends ElementType = 'ul'>(
  { children, className, component, items, layout, variant, ...rest }: NavProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'ul'
  const _className = classNames(
    'nav',
    {
      [`nav-${layout}`]: layout,
      [`nav-${variant}`]: variant
    },
    className
  )

  const autoContent = items
    ? items.map((item, idx) => (
        <NavItem
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          active={item.active}
          disabled={item.disabled}
          href={item.href}
        >
          {item.label}
        </NavItem>
      ))
    : null

  return (
    <Component className={_className} role="navigation" {...rest} ref={ref}>
      {autoContent ?? children}
    </Component>
  )
}

export const Nav = createPolymorphicComponent<NavComponent>(
  NavRender as ForwardRefRenderFunction<Element, NavProps<ElementType>>,
  'Nav'
)
