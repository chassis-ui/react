import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor, ContextStyle } from '../../types'

export interface ListItemDef {
  /**
   * Item label content.
   */
  label: React.ReactNode
  /**
   * Makes the item a link.
   */
  href?: string
  /**
   * Sets the color of the item.
   */
  color?: ContextColor
  /**
   * Marks the item as active.
   */
  active?: boolean
  /**
   * Marks the item as disabled.
   */
  disabled?: boolean
}

export interface ListProps extends HTMLAttributes<HTMLDivElement | HTMLUListElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Remove outer borders and rounded corners to render list items edge-to-edge in a parent component (e.g., `<Card>`).
   */
  flush?: boolean
  /**
   * Array of item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: ListItemDef[]
  /**
   * Specify a layout type.
   */
  layout?:
    | 'horizontal'
    | 'small:horizontal'
    | 'medium:horizontal'
    | 'large:horizontal'
    | 'xlarge:horizontal'
    | '2xlarge:horizontal'
  /**
   * Number list items sequentially using CSS counters. Pair with `component="ol"` for semantic correctness.
   */
  numbered?: boolean
  /**
   * Remove outer borders, rounded corners, and horizontal padding for a minimal, edge-to-edge appearance.
   */
  plain?: boolean
  /**
   * Applies a `.solid`, `.outline`, or `.smooth` context style. Only meaningful together with `color`.
   */
  variant?: ContextStyle
}

export const List = forwardRef<HTMLDivElement | HTMLUListElement, ListProps>(
  (
    {
      children,
      className,
      component: Component = 'ul',
      color,
      variant,
      flush,
      items,
      layout,
      numbered,
      plain,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      'list',
      color && 'context',
      color,
      variant,
      layout,
      {
        flush,
        plain,
        numbered
      },
      className
    )

    const autoContent = items
      ? items.map((item, idx) => {
          const itemClass = classNames('list-item', item.color && 'context', item.color, {
            'list-action': !!item.href,
            active: item.active,
            disabled: item.disabled
          })
          const Tag = item.href ? 'a' : 'li'
          return (
            <Tag
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={itemClass}
              {...(item.href ? { href: item.href } : {})}
              {...(item.active ? { 'aria-current': 'page' } : {})}
              {...(item.disabled ? { 'aria-disabled': true } : {})}
            >
              {item.label}
            </Tag>
          )
        })
      : null

    return (
      <Component className={_className} {...rest} ref={ref}>
        {autoContent ?? children}
      </Component>
    )
  }
)

List.displayName = 'List'
