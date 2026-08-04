import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { ContextColor, ExtendedSizing } from '../Types'
import { Avatar } from './Avatar'

export interface AvatarStackItemDef {
  /**
   * React key for the rendered `Avatar`. Falls back to the item's index in `data`.
   */
  key?: string | number
  /**
   * Image source, rendered via `AvatarImage`.
   */
  src?: string
  /**
   * Alt text for the image rendered when `src` is set.
   */
  alt?: string
  /**
   * Renders the avatar as a link to this URL.
   */
  href?: string
  /**
   * Renders a status badge in one of the Chassis themed colors.
   */
  status?: ContextColor
  /**
   * Accessible label for the status badge.
   */
  statusLabel?: string
  /**
   * Content to render when `src` isn't set, e.g. initials or a "+5" overflow count.
   */
  content?: ReactNode
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | React.ElementType
}

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the size of every `Avatar` in the stack to one of Chassis component sizes.
   */
  size?: ExtendedSizing
  /**
   * Renders a `Avatar` for each item, ahead of any JSX `children` (handy for a trailing "+N"
   * overflow avatar).
   */
  items?: AvatarStackItemDef[]
}

export const AvatarStack = forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ children, className, size, items, ...rest }, ref) => {
    const _className = classNames('avatar-stack', size, className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {items?.map(({ key, content, ...item }, index) => (
          <Avatar key={key ?? index} {...item}>
            {content}
          </Avatar>
        ))}
        {children}
      </div>
    )
  }
)

AvatarStack.displayName = 'AvatarStack'
