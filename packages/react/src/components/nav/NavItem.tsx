import React, {
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref
} from 'react'
import classNames from 'classnames'

import { devWarning } from '../../utils/devWarning'
import { hasHref } from '../../utils/elementKind'
import { NavLink, NavLinkProps } from './NavLink'

type NavItemComponent = (<C extends ElementType = 'a'>(
  props: NavLinkProps<C> & { ref?: Ref<HTMLLIElement> }
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
  { children, className, ...rest }: NavLinkProps<C>,
  ref: Ref<HTMLLIElement>
) {
  const _className = classNames('nav-item', className)
  const { asChild, component, href } = rest as {
    asChild?: boolean
    component?: ElementType
    href?: string
  }

  if (hasHref(href) || component !== undefined || asChild) {
    return (
      <li className={_className} ref={ref}>
        <NavLink {...(rest as Record<string, unknown>)}>{children as ReactNode}</NavLink>
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
    <li className={_className} {...itemProps} ref={ref}>
      {children}
    </li>
  )
}

export const NavItem = forwardRef(
  NavItemRender as ForwardRefRenderFunction<HTMLLIElement, NavLinkProps<ElementType>>
) as NavItemComponent

NavItem.displayName = 'NavItem'
