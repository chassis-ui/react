import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { NavOverflowLink, useIsNavOverflowLink } from '../../utils/navOverflow'
import { createPolymorphicComponent, PolymorphicRef } from '../../utils/polymorphic'
import { LinkProps, Link } from '../link/Link'

type NavLinkOwnProps = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
}

export type NavLinkProps<C extends ElementType = 'a'> = LinkProps<C> & NavLinkOwnProps

type NavLinkComponent = (<C extends ElementType = 'a'>(
  props: NavLinkProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NavLinkRender<C extends ElementType = 'a'>(
  { children, className, ...rest }: NavLinkProps<C>,
  ref: PolymorphicRef<C>
) {
  const _className = classNames('nav-link', className)
  // Inside a `NavOverflow`, the link of an item that doesn't fit is shown in the menu instead, as
  // a `MenuItem` with these props.
  const isOverflowLink = useIsNavOverflowLink()

  return (
    <>
      <Link
        className={_className}
        {...(rest as Record<string, unknown>)}
        ref={ref as PolymorphicRef<ElementType>}
      >
        {children}
      </Link>
      {isOverflowLink && <NavOverflowLink props={{ ...rest, children }} />}
    </>
  )
}

export const NavLink = createPolymorphicComponent<NavLinkComponent>(
  NavLinkRender as ForwardRefRenderFunction<Element, NavLinkProps<ElementType>>,
  'NavLink'
)
