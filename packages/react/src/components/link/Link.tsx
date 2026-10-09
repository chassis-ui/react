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
import { LINK_COLOR_CLASS_NAMES } from '../../utils/colorClassNames'
import { useButtonSemantics, useDisabledAnchorGuard, useForkedRef } from '../../hooks'
import { hrefProps, isInteractiveKind, linkElement, resolveLinkKind } from '../../utils/elementKind'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { useScrollspyLink } from '../../utils/scrollspy'

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
   * The href attribute specifies the URL of the page the link goes to. Reaches an `<a>` or a
   * component reference (a router link); dropped, with a warning in development, when
   * `component` is another element. Declared explicitly here — rather than left to flow through
   * generically from whatever `C` is — so consumers that wrap `Link` (`MenuItem`, `ListItem`,
   * `NavLink`) can read it with a concrete type regardless of `component`.
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
    href,
    iconLink,
    onClick,
    reset,
    stretched,
    type = 'button',
    ...rest
  }: LinkProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = linkElement(component, href, 'a')
  // The kind rather than the tag, counting a router link with `href` or `to` as an anchor: under `asChild`, `Component` is a `Slot` standing in for the
  // caller's element, and a slotted `<a>` needs what `component="a"` gets.
  const kind = resolveLinkKind(Component, href, rest)

  const isInteractive = isInteractiveKind(kind)
  // A component reference without a link target (a router link with `href` or `to` is an anchor,
  // see `resolveLinkKind`) has its own visual identity and is trusted to
  // handle its own keyboard/role semantics, same as `CloseButton`'s `isComponentReference` escape
  // hatch — synthesizing `role="button"` and Enter/Space handling on top of it would stamp the
  // wrong ARIA role onto whatever it actually renders (e.g. an `<a>`) and can double-fire a click
  // (native anchor Enter→click, plus the synthesized keydown→click).
  const isComponentReference = kind === 'component'
  // Inside a `Scrollspy`, the link registers its element, is marked when its section is the one
  // being read, and scrolls to it smoothly when the `Scrollspy` is set to (`src/utils/scrollspy.ts`).
  const spy = useScrollspyLink(disabled)
  const spyClick = spy.onClick
  const clickHandler: MouseEventHandler<HTMLElement> | undefined = spyClick
    ? (event) => {
        onClick?.(event)
        spyClick(event)
      }
    : onClick
  // `<a>` has no real `disabled` attribute, so a disabled anchor link still fires click (and
  // still navigates) unless it's blocked here, same guard `Button`/`CloseButton` apply. A real
  // `<button>` already stops clicks on its own once the `disabled` attribute below is set.
  const handleClick = useDisabledAnchorGuard<HTMLElement>(kind === 'anchor', disabled, clickHandler)

  // A `component` that isn't a native interactive element gets a raw onClick with no
  // keyboard semantics otherwise — mouse-only, unlike `Button`/`CloseButton`, which
  // synthesize this via `useButtonSemantics` for exactly this "arbitrary component" case. A
  // component reference is excluded (see `isComponentReference` above).
  const needsButtonSemantics = !isInteractive && !isComponentReference && !!onClick
  const { buttonProps, forkedRef } = useButtonSemantics<HTMLElement>(ref as Ref<HTMLElement>, {
    disabled,
    onClick
  })
  const ownRef = needsButtonSemantics ? forkedRef : ref
  const spyRef = useForkedRef(ownRef as Ref<HTMLElement>, spy.ref)
  // A link to the section being read is `active` and `aria-current="true"`: the current place in
  // the page, not the current page. A link it belongs under, such as its menu's toggle, only
  // looks active. An `active` given as a prop wins.
  const isActive = active || !!spy.mark
  const ariaCurrent = active ? 'page' : spy.mark === 'current' ? 'true' : undefined

  const _className = classNames(
    color && LINK_COLOR_CLASS_NAMES[color],
    { 'icon-link': iconLink, 'fg-reset': reset, 'stretched-link': stretched },
    { active: isActive, disabled },
    className
  )

  return (
    <Component
      {...(mergeProps(rest, needsButtonSemantics ? buttonProps : {}) as Record<string, unknown>)}
      className={_className}
      {...hrefProps(kind, href, 'Link')}
      {...(ariaCurrent && { 'aria-current': ariaCurrent })}
      {...(kind === 'anchor' && disabled && { 'aria-disabled': true, tabIndex: -1 })}
      {...(!needsButtonSemantics && { onClick: handleClick })}
      {...(kind === 'button' && { disabled, type })}
      ref={spy.ref ? spyRef : ownRef}
    >
      {children}
    </Component>
  )
}

export const Link = createPolymorphicComponent<LinkComponent>(
  LinkRender as ForwardRefRenderFunction<Element, LinkProps<ElementType>>,
  'Link'
)
