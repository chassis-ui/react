import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import {
  hrefProps,
  isInteractiveKind,
  linkElement,
  resolveElementTag,
  resolveLinkKind
} from '../../utils/elementKind'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef,
  PolymorphicRefWithFallback
} from '../../utils/polymorphic'
import { Link } from '../link/Link'

type ListItemOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * The href attribute specifies the URL of the page the link goes to. Renders an `<a>` in place
   * of the `<li>`, unless `component` or `asChild` chose the element. Inside a `List`, the list
   * renders a `<div>` around it in place of the `<ul>`.
   */
  href?: string
}

export type ListItemProps<C extends ElementType = 'li'> = PolymorphicComponentProps<
  C,
  ListItemOwnProps<C>
>

type ListItemComponent = (<C extends ElementType = 'li'>(
  props: ListItemProps<C> & {
    ref?: PolymorphicRefWithFallback<C, HTMLLIElement | HTMLAnchorElement>
  }
) => ReactElement | null) & { displayName?: string }

function ListItemRender<C extends ElementType = 'li'>(
  { children, active, className, disabled, color, component, href, ...rest }: ListItemProps<C>,
  ref: PolymorphicRef<C>
) {
  // `href` makes it an `<a>`, unless `component` or `asChild` chose the element (see
  // `linkElement`). It used to stay an `<li>` and carry `href` as an attribute.
  const tag = linkElement(component, href, 'li')
  // The kind rather than the tag, counting a router link with `href` or `to` as an anchor: under `asChild`, `tag` is a `Slot` standing in for the caller's
  // element, and a slotted `<a>` is as interactive as `component="a"`.
  const kind = resolveLinkKind(tag, href, rest)
  const isInteractive = isInteractiveKind(kind)
  const linkProps = hrefProps(kind, href, 'ListItem')

  // A component (a router link given as `component`, or as the `asChild` element) renders through
  // `Link` whether or not it has a link target. It did only while it had one, so a router link
  // whose `href` came or went was a different tree each time, and React remounted it. `Link`
  // leaves a component that isn't a link to its own semantics.
  const throughLink = isInteractive || resolveElementTag(tag) === undefined

  const _className = classNames(
    'list-item',
    color && 'context',
    color,
    {
      'list-action': isInteractive,
      // `Link` adds these classes, and `aria-current`, itself.
      active: active && !throughLink,
      disabled: disabled && !throughLink
    },
    className
  )

  const Component = (throughLink ? Link : tag) as ElementType

  const finalRest = throughLink
    ? {
        active,
        disabled,
        component: tag,
        // `Link` writes it on a link, which it also takes out of the tab order.
        ...(disabled && !isInteractive && { 'aria-disabled': true }),
        ...linkProps,
        ...rest
      }
    : {
        ...(active && { 'aria-current': 'page' }),
        ...(disabled && { 'aria-disabled': true }),
        ...linkProps,
        ...rest
      }

  return (
    <Component className={_className} {...finalRest} ref={ref}>
      {children}
    </Component>
  )
}

export const ListItem = createPolymorphicComponent<ListItemComponent>(
  ListItemRender as ForwardRefRenderFunction<Element, ListItemProps<ElementType>>,
  'ListItem'
)
