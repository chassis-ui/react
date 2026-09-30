import React, {
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref
} from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks'
import { devWarning } from '../../utils/devWarning'
import { hasHref } from '../../utils/elementKind'
import { NavOverflowItemScope, useNavOverflowItem } from '../../utils/navOverflow'
import { NavLink, NavLinkProps } from './NavLink'

export type NavItemProps<C extends ElementType = 'a'> = NavLinkProps<C> & {
  /**
   * Keeps the item in the list inside a `NavOverflow`, whatever the width.
   */
  keepVisible?: boolean
}

type NavItemComponent = (<C extends ElementType = 'a'>(
  props: NavItemProps<C> & { ref?: Ref<HTMLLIElement> }
) => ReactElement | null) & { displayName?: string }

const LINK_ONLY_PROPS = new Set([
  'active',
  'color',
  'disabled',
  'iconLink',
  'reset',
  'stretched',
  'type'
])

// A `.nav-item` wrapping a `.nav-link` when there is a link to render: an `href`, or a `component`
// or `asChild` element, which `NavLink` renders. Otherwise a bare `<li>` around `children`, such as
// a `MenuToggle`. Only the `<li>` takes the caller's own attributes then: `active`, `disabled` and
// the other `NavLink` props style a link, and on the `<li>` they were written out as invalid
// attributes (`disabled=""`, `component="button"`).
function NavItemRender<C extends ElementType = 'a'>(
  { children, className, keepVisible, ...rest }: NavItemProps<C>,
  ref: Ref<HTMLLIElement>
) {
  const _className = classNames('nav-item', { 'nav-overflow-keep': keepVisible }, className)
  const { asChild, component, href } = rest as {
    asChild?: boolean
    component?: ElementType
    href?: string
  }
  // Inside a `NavOverflow`: the `<li>` is what it measures, and hides when the item is in the
  // menu. chassis-css hides it by this attribute.
  const overflow = useNavOverflowItem()
  const forkedRef = useForkedRef(ref, overflow.ref)
  const overflowProps = overflow.hidden ? { 'data-cx-nav-overflow': 'true' } : undefined

  if (hasHref(href) || component !== undefined || asChild) {
    return (
      <li className={_className} {...overflowProps} ref={forkedRef}>
        <NavOverflowItemScope value={overflow.scope}>
          <NavLink {...(rest as Record<string, unknown>)}>{children as ReactNode}</NavLink>
        </NavOverflowItemScope>
      </li>
    )
  }

  const { active, disabled } = rest as NavLinkProps<'a'>
  const itemProps = Object.fromEntries(
    Object.entries(rest).filter(([key]) => !LINK_ONLY_PROPS.has(key))
  )
  devWarning(
    !!active || !!disabled,
    'NavItem: `active` and `disabled` style its link, and without `href`, `component` or ' +
      '`asChild` it renders none. Put them on the link inside it.'
  )
  return (
    <li className={_className} {...itemProps} {...overflowProps} ref={forkedRef}>
      <NavOverflowItemScope value={overflow.scope}>{children}</NavOverflowItemScope>
    </li>
  )
}

export const NavItem = forwardRef(
  NavItemRender as ForwardRefRenderFunction<HTMLLIElement, NavItemProps<ElementType>>
) as NavItemComponent

NavItem.displayName = 'NavItem'
