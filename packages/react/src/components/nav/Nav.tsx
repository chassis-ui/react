import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { resolveElementTag } from '../../utils/elementKind'
import { NavOverflowItems } from '../../utils/navOverflow'
import { NavVariant, navVariantClassName } from '../../utils/navVariant'
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
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * Set the nav variant to tabs, to segments (a segmented control) or to underline, which
   * underlines the active link. `'pills'` is the former name of `'segments'`: deprecated, it
   * renders the same.
   *
   * @type { 'tabs' | 'segments' | 'underline' | 'pills' }
   */
  variant?: NavVariant
}

export type NavProps<C extends ElementType = 'ul'> = PolymorphicComponentProps<C, NavOwnProps<C>>

type NavComponent = (<C extends ElementType = 'ul'>(
  props: NavProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NavRender<C extends ElementType = 'ul'>(
  { children, className, component, items, layout, size, variant, ...rest }: NavProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'ul'
  const _className = classNames(
    'nav',
    size,
    { [`nav-${layout}`]: layout },
    navVariantClassName(variant, 'Nav'),
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

  // No `role`: `navigation` on the `<ul>` took away its list semantics, and `ul` doesn't allow
  // that role. A landmark is the caller's `<nav>` around it, or `component="nav"` holding
  // `NavLink`s without items.
  return (
    <Component className={_className} {...rest} ref={ref}>
      {/* Inside a `NavOverflow`, the items it collapses and its toggle item. */}
      <NavOverflowItems tag={resolveElementTag(Component)}>
        {autoContent ?? children}
      </NavOverflowItems>
    </Component>
  )
}

export const Nav = createPolymorphicComponent<NavComponent>(
  NavRender as ForwardRefRenderFunction<Element, NavProps<ElementType>>,
  'Nav'
)
