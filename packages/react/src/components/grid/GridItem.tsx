import React, { CSSProperties, ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { buildResponsiveClassNames } from '../../utils/breakpoints'
import { Breakpoint, Spacing } from '../../types'
import { gapClassName, gapValue } from './gap'

type GridItemStyle = CSSProperties & {
  '--cx-grid-rows'?: number
  '--cx-grid-gap'?: string
}

export interface GridItemLayout {
  /**
   * Number of grid column tracks (of the parent `<Grid>`'s `columns`) this item spans, mapped to
   * the `col-span-{n}` class, or `'full'` for every track of the row (`col-span-full`). An item
   * with no `span` is one track wide.
   *
   * @type { number | 'full' }
   */
  span?: number | 'full'
  /**
   * Grid column line to start this item at, mapped to the `col-start-{n}` class. `'auto'`
   * (`col-start-auto`) returns the item to the flow, to undo a start line at a wider breakpoint.
   *
   * @type { number | 'auto' }
   */
  start?: number | 'auto'
  /**
   * Number of grid row tracks this item spans, mapped to the `row-span-{n}` class.
   */
  rowSpan?: number
  /**
   * Grid row line to start this item at, mapped to the `row-start-{n}` class, or `'auto'`
   * (`row-start-auto`) to return it to the flow.
   *
   * @type { number | 'auto' }
   */
  rowStart?: number | 'auto'
}

type GridItemOwnProps<C extends ElementType> = GridItemLayout & {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Overrides `span`/`start`/`rowSpan`/`rowStart` at a breakpoint and up.
   *
   * @type { Partial<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', { span?: number | 'full', start?: number | 'auto', rowSpan?: number, rowStart?: number | 'auto' }>> }
   */
  responsive?: Partial<Record<Breakpoint, GridItemLayout>>
  /**
   * Turns this item into a nested subgrid: adds `.grid`/`.grid-cols-subgrid` alongside its
   * `col-span-{n}`/`col-start-{n}` placement classes, so its own children inherit the parent
   * `<Grid>`'s column tracks instead of defining new ones. Combine with `span` — a subgrid
   * item must itself be a grid item of the parent for `grid-template-columns: subgrid` to take
   * effect, which is why `subgrid` lives on `<GridItem>` (the element actually placed as a grid
   * item) rather than on a `<Grid>` nested inside it.
   */
  subgrid?: boolean
  /**
   * Number of rows in the subgrid's own row template, set via the `--cx-grid-rows` custom
   * property (defaults to `1` in CSS when omitted). Only relevant when `subgrid` is set —
   * subgrid only inherits the parent's column tracks, not its rows.
   */
  rows?: number
  /**
   * Gap between the subgrid's children: a `Spacing` token (mapped to the `gap-{token}` class) or
   * any raw CSS `gap` value (set via the `--cx-grid-gap` custom property). Only relevant when
   * `subgrid` is set. A subgrid has the gap of its own: when the parent `<Grid>` takes a `gap`
   * token, give the subgrid the same one, or its children are narrower than the parent's tracks.
   *
   * @type { Spacing | string }
   */
  gap?: Spacing | (string & {})
}

export type GridItemProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  GridItemOwnProps<C>
>

type GridItemComponent = (<C extends ElementType = 'div'>(
  props: GridItemProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

const layoutClassNames = ({ span, start, rowSpan, rowStart }: GridItemLayout, prefix: string) => [
  span === undefined ? null : `${prefix}col-span-${span}`,
  start === undefined ? null : `${prefix}col-start-${start}`,
  rowSpan === undefined ? null : `${prefix}row-span-${rowSpan}`,
  rowStart === undefined ? null : `${prefix}row-start-${rowStart}`
]

function GridItemRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    component,
    span,
    start,
    rowSpan,
    rowStart,
    responsive,
    subgrid,
    rows,
    gap,
    style,
    ...rest
  }: GridItemProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    buildResponsiveClassNames(layoutClassNames, { span, start, rowSpan, rowStart }, responsive),
    subgrid && 'grid grid-cols-subgrid',
    subgrid && gapClassName(gap),
    className
  )

  const _style: GridItemStyle = { ...style }

  if (subgrid) {
    if (rows !== undefined) _style['--cx-grid-rows'] = rows
    const _gap = gapValue(gap)
    if (_gap !== undefined) _style['--cx-grid-gap'] = _gap
  }

  return (
    <Component className={_className} style={_style} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const GridItem = createPolymorphicComponent<GridItemComponent>(
  GridItemRender as ForwardRefRenderFunction<Element, GridItemProps<ElementType>>,
  'GridItem'
)
