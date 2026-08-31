import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { Breakpoint, ContextColor, ContextStyle } from '../../types'

type NavbarOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Defines optional container wrapping children elements.
   */
  container?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | 'fluid'
  /**
   * Opts this navbar into the framework's dark or light theming, independent of the page's own
   * theme.
   */
  'data-cx-theme'?: 'dark' | 'light'
  /**
   * Renders inline at and above this breakpoint, as a drawer below it. `true` renders inline at
   * every width; omit to keep the drawer at every width.
   */
  expand?: boolean | Breakpoint
  /**
   * Place component in non-static positions.
   */
  placement?: 'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom'
  /**
   * Blurs and saturates whatever sits behind the navbar — useful when it's positioned over a
   * hero image, video, or scrollable content.
   */
  translucent?: boolean
  /**
   * Sets the context style of the component. `basic` (the default) renders with no extra class.
   */
  variant?: ContextStyle
}

export type NavbarProps<C extends ElementType = 'nav'> = PolymorphicComponentProps<
  C,
  NavbarOwnProps<C>
>

type NavbarComponent = (<C extends ElementType = 'nav'>(
  props: NavbarProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NavbarRender<C extends ElementType = 'nav'>(
  {
    children,
    className,
    color,
    component,
    container,
    expand,
    placement,
    translucent,
    variant,
    ...rest
  }: NavbarProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'nav'
  const _className = classNames(
    'navbar',
    color,
    {
      context: !!color,
      solid: variant === 'solid',
      smooth: variant === 'smooth',
      outline: variant === 'outline',
      translucent,
      [typeof expand === 'boolean' ? 'navbar-expand' : `${expand}:navbar-expand`]: expand
    },
    placement,
    className
  )

  let content
  if (container) {
    content = (
      <div className={`container${container !== true ? '-' + container : ''}`}>{children}</div>
    )
  } else {
    content = children
  }

  return (
    <Component className={_className} {...rest} ref={ref}>
      {content}
    </Component>
  )
}

export const Navbar = createPolymorphicComponent<NavbarComponent>(
  NavbarRender as ForwardRefRenderFunction<Element, NavbarProps<ElementType>>,
  'Navbar'
)
