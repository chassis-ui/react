import React, {
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref
} from 'react'
import classNames from 'classnames'

import { NavLink, NavLinkProps } from './NavLink'

type NavItemComponent = (<C extends ElementType = 'a'>(
  props: NavLinkProps<C> & { ref?: Ref<HTMLLIElement> }
) => ReactElement | null) & { displayName?: string }

function NavItemRender<C extends ElementType = 'a'>(
  { children, className, ...rest }: NavLinkProps<C>,
  ref: Ref<HTMLLIElement>
) {
  const _className = classNames('nav-item', className)
  const { href } = rest as { href?: string }

  if (href) {
    return (
      <li className={_className} ref={ref}>
        <NavLink {...(rest as Record<string, unknown>)}>{children as ReactNode}</NavLink>
      </li>
    )
  }
  return (
    <li className={_className} {...(rest as Record<string, unknown>)} ref={ref}>
      {children}
    </li>
  )
}

export const NavItem = forwardRef(
  NavItemRender as ForwardRefRenderFunction<HTMLLIElement, NavLinkProps<ElementType>>
) as NavItemComponent

NavItem.displayName = 'NavItem'
