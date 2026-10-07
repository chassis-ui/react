import React, { CSSProperties, ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { buildResponsiveClassNames, GRID_BREAKPOINTS } from '../../utils/breakpoints'
import { Breakpoint, ContainerBreakpoint, Spacing } from '../../types'
import { gapClassName, gapValue } from './gap'
import { hasRowsClass, rowsTemplate } from './rows'

type GridItemStyle = CSSProperties & {
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
   * Grid column line to start this item at, mapped to the `col-start-{n}` class (1 to 12).
   * `'auto'` (`col-start-auto`) returns the item to the flow, to undo a start line at a wider
   * breakpoint.
   *
   * @type { number | 'auto' }
   */
  start?: number | 'auto'
  /**
   * Grid column line to end this item at, mapped to the `col-end-{n}` class (1 to 13, the line
   * after the last of 12 columns). With `span`, it places the item against the end edge of the
   * grid: `span={3} end={13}`. `'auto'` (`col-end-auto`) undoes an end line at a wider
   * breakpoint.
   *
   * @type { number | 'auto' }
   */
  end?: number | 'auto'
  /**
   * Number of grid row tracks this item spans, mapped to the `row-span-{n}` class.
   */
  rowSpan?: number
  /**
   * Grid row line to start this item at, mapped to the `row-start-{n}` class (1 to 6), or
   * `'auto'` (`row-start-auto`) to return it to the flow.
   *
   * @type { number | 'auto' }
   */
  rowStart?: number | 'auto'
  /**
   * Grid row line to end this item at, mapped to the `row-end-{n}` class (1 to 7, the line after
   * the last of 6 rows), or `'auto'` (`row-end-auto`) to undo an end line at a wider breakpoint.
   *
   * @type { number | 'auto' }
   */
  rowEnd?: number | 'auto'
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
   * Overrides `span`/`start`/`end`/`rowSpan`/`rowStart`/`rowEnd` from a width up. A breakpoint
   * key (`md`) is a width of the viewport. A container key (`'@md'`) is the same width of the
   * nearest query container (an ancestor with the `contains-inline` class), and wins over a
   * breakpoint key where both apply. Without a query container above the grid, a container key
   * never applies.
   *
   * @type { Partial<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '@sm' | '@md' | '@lg' | '@xl' | '@2xl', { span?: number | 'full', start?: number | 'auto', end?: number | 'auto', rowSpan?: number, rowStart?: number | 'auto', rowEnd?: number | 'auto' }>> }
   */
  responsive?: Partial<Record<Breakpoint | ContainerBreakpoint, GridItemLayout>>
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
   * Number of equal rows in the subgrid's own row template: the `grid-rows-{n}` class for a
   * count from 1 to 6, the same `grid-template-rows` set inline for any other. Only relevant
   * when `subgrid` is set — subgrid only inherits the parent's column tracks, not its rows.
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

const layoutClassNames = (
  { span, start, end, rowSpan, rowStart, rowEnd }: GridItemLayout,
  prefix: string
) => [
  span === undefined ? null : `${prefix}col-span-${span}`,
  start === undefined ? null : `${prefix}col-start-${start}`,
  end === undefined ? null : `${prefix}col-end-${end}`,
  rowSpan === undefined ? null : `${prefix}row-span-${rowSpan}`,
  rowStart === undefined ? null : `${prefix}row-start-${rowStart}`,
  rowEnd === undefined ? null : `${prefix}row-end-${rowEnd}`
]

function GridItemRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    component,
    span,
    start,
    end,
    rowSpan,
    rowStart,
    rowEnd,
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
    buildResponsiveClassNames(
      layoutClassNames,
      { span, start, end, rowSpan, rowStart, rowEnd },
      responsive,
      GRID_BREAKPOINTS
    ),
    subgrid && 'grid grid-cols-subgrid',
    subgrid && hasRowsClass(rows) && `grid-rows-${rows}`,
    subgrid && gapClassName(gap),
    className
  )

  const _style: GridItemStyle = { ...style }

  if (subgrid) {
    const _rows = rowsTemplate(rows)
    if (_rows !== undefined) _style.gridTemplateRows = _rows
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
