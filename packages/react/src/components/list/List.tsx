import React, {
  Children,
  ElementType,
  ForwardRefRenderFunction,
  isValidElement,
  ReactElement
} from 'react'
import classNames from 'classnames'

import { ContextColor, ContextStyle } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { ListItem } from './ListItem'

export interface ListItemDef {
  /**
   * Stable key for the rendered item. Falls back to the item's index in `items`.
   */
  id?: number | string
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

type ListOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `'ul'`, unless an item (a data-driven item with `href`, or a `<ListItem
   * component="a">`/`<ListItem component="button">` child) is interactive — a bare `<a>`/
   * `<button>` isn't a valid direct child of `<ul>`/`<ol>`, so the default switches to `'div'`
   * instead. Pass `component` explicitly to opt out of this.
   */
  component?: C
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

export type ListProps<C extends ElementType = 'ul'> = PolymorphicComponentProps<C, ListOwnProps<C>>

type ListComponent = (<C extends ElementType = 'ul'>(
  props: ListProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ListRender<C extends ElementType = 'ul'>(
  {
    children,
    className,
    component,
    color,
    variant,
    flush,
    items,
    layout,
    numbered,
    plain,
    ...rest
  }: ListProps<C>,
  ref: PolymorphicRef<C>
) {
  // A linked item (data-driven `href`, or a `<ListItem component="a"|"button">` child) can't
  // render as a bare `<a>`/`<button>` inside the default `<ul>`/`<ol>` root — only `<li>`/
  // `script`/`template` are valid children there. Default to `<div>` instead when that's the
  // case (unless the caller already chose their own `component`), matching the same
  // `component="div"` pattern already documented for `Stepper`'s composed interactive usage.
  const hasInteractiveItem = items
    ? items.some((item) => !!item.href)
    : Children.toArray(children).some(
        (child) =>
          isValidElement<{ component?: string | ElementType }>(child) &&
          child.type === ListItem &&
          (child.props.component === 'a' || child.props.component === 'button')
      )
  const Component = (component ?? (hasInteractiveItem ? 'div' : 'ul')) as ElementType
  const isListSemantic = Component === 'ul' || Component === 'ol'

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
        const Tag = item.href ? 'a' : isListSemantic ? 'li' : 'div'
        return (
          <Tag
            key={item.id ?? idx}
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

  // When the root switched to `div` because of an interactive child, every plain `<ListItem>`
  // sibling defaulting to `<li>` would be just as invalid (only valid inside `<ul>`/`<ol>`/
  // `<menu>`) — so give each `ListItem` child the same `div` treatment the auto-generated items
  // above already get, unless it set its own `component`. Other child types are left untouched
  // — this is only meaningful for `List`'s own list items.
  const renderedChildren =
    autoContent ??
    (isListSemantic
      ? children
      : Children.map(children, (child) =>
          isValidElement<{ component?: string | ElementType }>(child) && child.type === ListItem
            ? React.cloneElement(child, { component: child.props.component ?? 'div' })
            : child
        ))

  return (
    <Component className={_className} {...rest} ref={ref}>
      {renderedChildren}
    </Component>
  )
}

export const List = createPolymorphicComponent<ListComponent>(
  ListRender as ForwardRefRenderFunction<Element, ListProps<ElementType>>,
  'List'
)
