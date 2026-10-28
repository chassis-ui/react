import React, {
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  LiHTMLAttributes,
  MouseEventHandler,
  ReactElement,
  Ref
} from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { devWarning } from '../../utils/devWarning'
import { hasHref } from '../../utils/elementKind'
import { NavOverflowItemScope, useNavOverflowItem } from '../../utils/navOverflow'
import { NavLink, NavLinkProps } from './NavLink'

type NavItemOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state of the item's link.
   */
  active?: boolean
  /**
   * Render the item's link as its child element, as `NavLink`'s `asChild` does.
   */
  asChild?: boolean
  /**
   * A string of all className you want applied to the `<li>`, which takes the ref and the other
   * attributes too.
   */
  className?: string
  /**
   * Component used for the item's link. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Toggle the disabled state of the item's link.
   */
  disabled?: boolean
  /**
   * URL for the item's link.
   */
  href?: string
  /**
   * Keeps the item in the list inside a `NavOverflow`, whatever the width.
   */
  keepVisible?: boolean
  /**
   * Any other props of the item's link, such as a router link's `to`, `target` or `aria-label`,
   * and its own `className`.
   */
  linkProps?: Omit<
    NavLinkProps<C>,
    'active' | 'asChild' | 'children' | 'component' | 'disabled' | 'href' | 'onClick'
  >
  /**
   * Callback fired on a click of the item's link, or of the `<li>` when it has none.
   */
  onClick?: MouseEventHandler<HTMLElement>
}

export type NavItemProps<C extends ElementType = 'a'> = Omit<
  LiHTMLAttributes<HTMLLIElement>,
  keyof NavItemOwnProps<C>
> &
  NavItemOwnProps<C>

type NavItemComponent = (<C extends ElementType = 'a'>(
  props: NavItemProps<C> & { ref?: Ref<HTMLLIElement> }
) => ReactElement | null) & { displayName?: string }

// A `.nav-item` wrapping a `.nav-link` when there is a link to render: an `href`, or a `component`
// or `asChild` element, which `NavLink` renders. Otherwise a bare `<li>` around `children`, such as
// a `MenuToggle`. Either way the `<li>` takes `className`, the ref and the other attributes, as
// `BreadcrumbItem`'s does; the link takes the props that make it one, and `linkProps`. The `<li>`
// took `className` and the ref while the link took the rest.
function NavItemRender<C extends ElementType = 'a'>(
  {
    active,
    asChild,
    children,
    className,
    component,
    disabled,
    href,
    keepVisible,
    linkProps,
    onClick,
    ...rest
  }: NavItemProps<C>,
  ref: Ref<HTMLLIElement>
) {
  const _className = classNames('nav-item', { 'nav-overflow-keep': keepVisible }, className)
  // Inside a `NavOverflow`: the `<li>` is what it measures, and hides when the item is in the
  // menu. chassis-css hides it by this attribute.
  const overflow = useNavOverflowItem()
  const forkedRef = useForkedRef(ref, overflow.ref)
  const overflowProps = overflow.hidden ? { 'data-cx-nav-overflow': 'true' } : undefined

  if (hasHref(href) || component !== undefined || asChild) {
    // Only the props given, so the link (and the menu item a `NavOverflow` copies from it) gets
    // no key set to `undefined`.
    const ownLinkProps = Object.fromEntries(
      Object.entries({ active, asChild, component, disabled, href, onClick }).filter(
        ([, value]) => value !== undefined
      )
    )
    return (
      <li className={_className} {...rest} {...overflowProps} ref={forkedRef}>
        <NavOverflowItemScope value={overflow.scope}>
          <NavLink {...(linkProps as Record<string, unknown>)} {...ownLinkProps}>
            {children}
          </NavLink>
        </NavOverflowItemScope>
      </li>
    )
  }

  devWarning(
    !!active || !!disabled || linkProps !== undefined,
    'NavItem: `active`, `disabled` and `linkProps` are for its link, and without `href`, ' +
      '`component` or `asChild` it renders none. Put them on the link inside it.'
  )
  return (
    <li className={_className} {...rest} onClick={onClick} {...overflowProps} ref={forkedRef}>
      <NavOverflowItemScope value={overflow.scope}>{children}</NavOverflowItemScope>
    </li>
  )
}

export const NavItem = forwardRef(
  NavItemRender as ForwardRefRenderFunction<HTMLLIElement, NavItemProps<ElementType>>
) as NavItemComponent

NavItem.displayName = 'NavItem'
