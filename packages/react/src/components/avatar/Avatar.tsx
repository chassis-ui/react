import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor, ExtendedSizing } from '../../types'
import { hrefProps, isInteractiveKind, linkElement, resolveLinkKind } from '../../utils/elementKind'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef,
  PolymorphicRefWithFallback
} from '../../utils/polymorphic'
import { Link } from '../link/Link'
import { Badge } from '../badge'
import { AvatarImage } from './AvatarImage'

type AvatarOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Toggle the disabled state for the component. Only applies when `component` is `a` or `button`.
   */
  disabled?: boolean
  /**
   * Renders the smooth (tinted background) context variant instead of the solid default.
   */
  smooth?: boolean
  /**
   * Sets the size of the component to one of Chassis component sizes.
   */
  size?: ExtendedSizing
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `span`, or `a` when `href` is set. Set explicitly to `button` (or another
   * interactive element/component) to make a non-link avatar focusable and clickable.
   */
  component?: C
  /**
   * Image source. When set, renders an `AvatarImage` in place of `children`.
   */
  src?: string
  /**
   * Alt text for the image rendered when `src` is set.
   */
  alt?: string
  /**
   * Renders the avatar as a link to this URL. Defaults `component` to `a`. Passed through to a
   * custom `component` too, regardless of whether it resolves to a native `a`/`button`.
   */
  href?: string
  /**
   * Renders a status badge in the bottom-end corner, in one of the Chassis themed colors.
   */
  status?: ContextColor
  /**
   * Accessible label for the status badge, exposed to assistive tech as visually hidden text.
   * Falls back to the `status` value itself.
   */
  statusLabel?: string
}

export type AvatarProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  AvatarOwnProps<C>
>

type AvatarComponent = (<C extends ElementType = 'span'>(
  props: AvatarProps<C> & {
    ref?: PolymorphicRefWithFallback<C, HTMLSpanElement | HTMLAnchorElement>
  }
) => ReactElement | null) & { displayName?: string }

function AvatarRender<C extends ElementType = 'span'>(
  {
    children,
    className,
    color,
    disabled,
    smooth,
    size,
    component,
    src,
    alt = 'Profile picture',
    href,
    status,
    statusLabel,
    ...rest
  }: AvatarProps<C>,
  ref: PolymorphicRef<C>
) {
  // `href` makes it an `<a>`, unless `component` or `asChild` chose the element (see
  // `linkElement`).
  const tag = linkElement(component, href, 'span')
  // The kind rather than the tag, counting a router link with `href` or `to` as an anchor: under `asChild`, `tag` is a `Slot` standing in for the caller's
  // element, and a slotted `<a>` is as interactive as `component="a"`.
  const kind = resolveLinkKind(tag, href, rest)
  const isInteractive = isInteractiveKind(kind)

  const _className = classNames(
    'avatar',
    color,
    size,
    { smooth },
    !isInteractive && { disabled },
    className
  )

  const Component = (isInteractive ? Link : tag) as ElementType

  return (
    <Component
      className={_className}
      {...(isInteractive && { component: tag })}
      // `Link` handles `disabled` on an `<a>` or `<button>`, a router link included; any other
      // component reference is trusted to. A plain tag has no `disabled` attribute and gets the
      // class alone.
      {...((isInteractive || kind === 'component') && { disabled })}
      {...hrefProps(kind, href, 'Avatar')}
      {...(kind === 'button' && { type: 'button' })}
      {...rest}
      ref={ref}
    >
      {src ? <AvatarImage src={src} alt={alt} /> : children}
      {status && (
        <Badge color={status} circle>
          <span className="visually-hidden">{statusLabel ?? status}</span>
        </Badge>
      )}
    </Component>
  )
}

export const Avatar = createPolymorphicComponent<AvatarComponent>(
  AvatarRender as ForwardRefRenderFunction<Element, AvatarProps<ElementType>>,
  'Avatar'
)
