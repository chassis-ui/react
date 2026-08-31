import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type MenuHeaderOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * ARIA role applied to the root node. Defaults to `'presentation'` — see the render function
   * for why.
   */
  role?: React.AriaRole
}

export type MenuHeaderProps<C extends ElementType = 'h4'> = PolymorphicComponentProps<
  C,
  MenuHeaderOwnProps<C>
>

type MenuHeaderComponent = (<C extends ElementType = 'h4'>(
  props: MenuHeaderProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function MenuHeaderRender<C extends ElementType = 'h4'>(
  { children, className, component, role = 'presentation', ...rest }: MenuHeaderProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'h4'
  const _className = classNames('menu-header', className)

  // Always rendered as a direct child of `role="menu"` (see MenuList) — ARIA's menu role only
  // permits menuitem/group/separator children, so a bare heading fails aria-required-children.
  // `role="presentation"` opts the element itself out without hiding its text content.
  return (
    <Component className={_className} role={role} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const MenuHeader = createPolymorphicComponent<MenuHeaderComponent>(
  MenuHeaderRender as ForwardRefRenderFunction<Element, MenuHeaderProps<ElementType>>,
  'MenuHeader'
)
