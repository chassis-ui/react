import React, {
  ElementType,
  ForwardRefRenderFunction,
  MouseEventHandler,
  ReactElement,
  Ref
} from 'react'
import classNames from 'classnames'
import { mergeProps } from 'react-aria'

import { ContextColor } from '../../types'
import { useButtonSemantics, useDisabledAnchorGuard } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type LinkOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the link color to one of Chassis context colors, including its interactive
   * (`:hover`/`:focus`/`:active`/`:visited`) states.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The href attribute specifies the URL of the page the link goes to. Only meaningful when
   * `component` resolves to (or accepts) `'a'`. Declared explicitly here — rather than left to
   * flow through generically from whatever `C` is — so consumers that wrap `Link` (`MenuItem`,
   * `ListItem`, `NavLink`) can read it with a concrete type regardless of `component`.
   */
  href?: string
  /**
   * Fires on click.
   */
  onClick?: MouseEventHandler<HTMLElement>
  /**
   * Aligns a leading or trailing icon with the link text using flexbox, with a gap between
   * them and an offset underline. Icons need to be passed as `children` alongside the text.
   * Named `iconLink` rather than `icon` to avoid colliding with components (e.g. `MenuItem`)
   * that already have their own, differently-typed `icon` prop for the icon content itself.
   */
  iconLink?: boolean
  /**
   * Removes the foreground color override, so the link inherits its color from the nearest
   * ancestor instead of the default link color.
   */
  reset?: boolean
  /**
   * Expands the link's click target to fill its positioned ancestor (the nearest ancestor with
   * a `position` other than `static`).
   */
  stretched?: boolean
  /**
   * Specifies the type of button. Only applies when `component="button"`. Different browsers may
   * use different default types for the `<button>` element, so always specify it explicitly.
   */
  type?: 'button' | 'submit' | 'reset'
}

export type LinkProps<C extends ElementType = 'a'> = PolymorphicComponentProps<C, LinkOwnProps<C>>

type LinkComponent = (<C extends ElementType = 'a'>(
  props: LinkProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function LinkRender<C extends ElementType = 'a'>(
  {
    children,
    active,
    className,
    color,
    component,
    disabled,
    iconLink,
    onClick,
    reset,
    stretched,
    type = 'button',
    ...rest
  }: LinkProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = (component ?? 'a') as ElementType

  const _className = classNames(
    color && `link-${color}`,
    { 'icon-link': iconLink, 'fg-reset': reset, 'stretched-link': stretched },
    { active, disabled },
    className
  )

  const isInteractive = Component === 'a' || Component === 'button'
  // A component reference (e.g. a router `Link`) has its own visual identity and is trusted to
  // handle its own keyboard/role semantics, same as `CloseButton`'s `isComponentReference` escape
  // hatch — synthesizing `role="button"` and Enter/Space handling on top of it would stamp the
  // wrong ARIA role onto whatever it actually renders (e.g. an `<a>`) and can double-fire a click
  // (native anchor Enter→click, plus the synthesized keydown→click).
  const isComponentReference = typeof Component !== 'string'
  // `<a>` has no real `disabled` attribute, so a disabled anchor link still fires click (and
  // still navigates) unless it's blocked here, same guard `Button`/`CloseButton` apply. A real
  // `<button>` already stops clicks on its own once the `disabled` attribute below is set.
  const handleClick = useDisabledAnchorGuard<HTMLElement>(Component === 'a', disabled, onClick)

  // A `component` that isn't a native interactive element gets a raw onClick with no
  // keyboard semantics otherwise — mouse-only, unlike `Button`/`CloseButton`, which
  // synthesize this via `useButtonSemantics` for exactly this "arbitrary component" case. A
  // component reference is excluded (see `isComponentReference` above).
  const needsButtonSemantics = !isInteractive && !isComponentReference && !!onClick
  const { buttonProps, forkedRef } = useButtonSemantics<HTMLElement>(ref as Ref<HTMLElement>, {
    disabled,
    onClick
  })

  return (
    <Component
      {...(mergeProps(rest, needsButtonSemantics ? buttonProps : {}) as Record<string, unknown>)}
      className={_className}
      {...(active && { 'aria-current': 'page' })}
      {...(Component === 'a' && disabled && { 'aria-disabled': true, tabIndex: -1 })}
      {...(!needsButtonSemantics && { onClick: handleClick })}
      {...(Component === 'button' && { disabled, type })}
      ref={needsButtonSemantics ? forkedRef : ref}
    >
      {children}
    </Component>
  )
}

export const Link = createPolymorphicComponent<LinkComponent>(
  LinkRender as ForwardRefRenderFunction<Element, LinkProps<ElementType>>,
  'Link'
)
