import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor, ExtendedSizing } from '../Types'
import { CxLink } from '../link/CxLink'
import { CxBadge } from '../badge/CxBadge'
import { CxAvatarImage } from './CxAvatarImage'

export interface CxAvatarProps extends HTMLAttributes<
  HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement
> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context color of the component to one of Chassis themed colors.
   */
  context?: ContextColor
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
   * Defaults to `button`, or `a` when `href` is set.
   */
  component?: string | ElementType
  /**
   * Image source. When set, renders a `CxAvatarImage` in place of `children`.
   */
  src?: string
  /**
   * Alt text for the image rendered when `src` is set.
   */
  alt?: string
  /**
   * Renders the avatar as a link to this URL. Defaults `component` to `a`.
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

export const CxAvatar = forwardRef<
  HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement,
  CxAvatarProps
>(
  (
    {
      children,
      className,
      context,
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
    },
    ref
  ) => {
    const tag = component ?? (href ? 'a' : 'button')
    const isInteractive = tag === 'a' || tag === 'button'

    const _className = classNames(
      'avatar',
      context,
      size,
      { smooth },
      !isInteractive && { disabled },
      className
    )

    const Component = (isInteractive ? CxLink : tag) as ElementType

    return (
      <Component
        className={_className}
        {...(isInteractive && { component: tag, disabled, href })}
        {...(tag === 'button' && { type: 'button' })}
        {...rest}
        ref={ref}
      >
        {src ? <CxAvatarImage src={src} alt={alt} /> : children}
        {status && (
          <CxBadge context={status} circle>
            <span className="visually-hidden">{statusLabel ?? status}</span>
          </CxBadge>
        )}
      </Component>
    )
  }
)

CxAvatar.displayName = 'CxAvatar'
