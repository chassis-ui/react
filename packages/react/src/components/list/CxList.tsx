import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CListItemDef {
  /**
   * Item label content.
   */
  label: React.ReactNode
  /**
   * Makes the item a link.
   */
  href?: string
  /**
   * Sets the context color of the item.
   */
  context?: ContextColor
  /**
   * Marks the item as active.
   */
  active?: boolean
  /**
   * Marks the item as disabled.
   */
  disabled?: boolean
}

export interface CListProps extends HTMLAttributes<HTMLDivElement | HTMLUListElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Sets the context color of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: ContextColor
  /**
   * Remove outer borders and rounded corners to render list items edge-to-edge in a parent component (e.g., `<CxCard>`).
   */
  flush?: boolean
  /**
   * Array of item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: CListItemDef[]
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
   * Applies a `.solid`, `.outline`, or `.smooth` context style. Only meaningful together with `context`.
   */
  contextStyle?: 'solid' | 'outline' | 'smooth'
}

export const CxList = forwardRef<HTMLDivElement | HTMLUListElement, CListProps>(
  (
    { children, className, component: Component = 'ul', context, contextStyle, flush, items, layout, numbered, plain },
    ref,
  ) => {
    const _className = classNames(
      'list',
      context && 'context',
      context,
      contextStyle,
      layout,
      {
        flush,
        plain,
        numbered,
      },
      className,
    )

    const autoContent = items
      ? items.map((item, idx) => {
          const itemClass = classNames(
            'list-item',
            item.context && 'context',
            item.context,
            {
              'list-action': !!item.href,
              active: item.active,
              disabled: item.disabled,
            },
          )
          const Tag = item.href ? 'a' : 'li'
          return (
            <Tag
              key={idx}
              className={itemClass}
              {...(item.href ? { href: item.href } : {})}
              {...(item.active ? { 'aria-current': true } : {})}
              {...(item.disabled ? { 'aria-disabled': true } : {})}
            >
              {item.label}
            </Tag>
          )
        })
      : null

    return (
      <Component className={_className} ref={ref}>
        {autoContent ?? children}
      </Component>
    )
  },
)

CxList.displayName = 'CxList'
