import React, { CSSProperties, ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { GRID_BREAKPOINTS, responsiveClassNames, responsiveProp } from '../../utils/breakpoints'
import { Breakpoint, ContainerBreakpoint, Responsive, Spacing } from '../../types'
import { gapClassName, gapValue } from './gap'
import { hasRowsClass, rowsTemplate } from './rows'

type GridItemStyle = CSSProperties & {
  '--cx-grid-gap'?: string
}

type GridItemOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Number of grid column tracks (of the parent `<Grid>`'s `columns`) this item spans, mapped to
   * the `col-span-{n}` class, or `'full'` for every track of the row (`col-span-full`). An item
   * with no `span` is one track wide.
   *
   * An object sets the span from a width up, as in `{ base: 'full', md: 6 }`, here and on
   * `start`, `end`, `rowSpan`, `rowStart` and `rowEnd`. A breakpoint key (`md`) is a width of
   * the viewport. A container key (`'@md'`) is the same width of the nearest query container
   * (an ancestor with the `contains-inline` class), and wins over a breakpoint key where both
   * apply. Without a query container above the grid, a container key never applies.
   *
   * @type { Responsive<number | 'full', Breakpoint | ContainerBreakpoint> }
   */
  span?: Responsive<number | 'full', Breakpoint | ContainerBreakpoint>
  /**
   * Grid column line to start this item at, mapped to the `col-start-{n}` class (1 to 12).
   * `'auto'` (`col-start-auto`) returns the item to the flow, to undo a start line at a wider
   * breakpoint: `{ base: 4, md: 'auto' }`.
   *
   * @type { Responsive<number | 'auto', Breakpoint | ContainerBreakpoint> }
   */
  start?: Responsive<number | 'auto', Breakpoint | ContainerBreakpoint>
  /**
   * Grid column line to end this item at, mapped to the `col-end-{n}` class (1 to 13, the line
   * after the last of 12 columns). With `span`, it places the item against the end edge of the
   * grid: `span={3} end={13}`. `'auto'` (`col-end-auto`) undoes an end line at a wider
   * breakpoint: `{ base: 13, md: 'auto' }`.
   *
   * @type { Responsive<number | 'auto', Breakpoint | ContainerBreakpoint> }
   */
  end?: Responsive<number | 'auto', Breakpoint | ContainerBreakpoint>
  /**
   * Number of grid row tracks this item spans, mapped to the `row-span-{n}` class. Takes an
   * object per width, as `span` does.
   */
  rowSpan?: Responsive<number, Breakpoint | ContainerBreakpoint>
  /**
   * Grid row line to start this item at, mapped to the `row-start-{n}` class (1 to 6), or
   * `'auto'` (`row-start-auto`) to return it to the flow. Takes an object per width, as `span`
   * does.
   *
   * @type { Responsive<number | 'auto', Breakpoint | ContainerBreakpoint> }
   */
  rowStart?: Responsive<number | 'auto', Breakpoint | ContainerBreakpoint>
  /**
   * Grid row line to end this item at, mapped to the `row-end-{n}` class (1 to 7, the line after
   * the last of 6 rows), or `'auto'` (`row-end-auto`) to undo an end line at a wider breakpoint.
   * Takes an object per width, as `span` does.
   *
   * @type { Responsive<number | 'auto', Breakpoint | ContainerBreakpoint> }
   */
  rowEnd?: Responsive<number | 'auto', Breakpoint | ContainerBreakpoint>
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
    responsiveClassNames(
      [
        responsiveProp(span, (value, prefix) => `${prefix}col-span-${value}`),
        responsiveProp(start, (value, prefix) => `${prefix}col-start-${value}`),
        responsiveProp(end, (value, prefix) => `${prefix}col-end-${value}`),
        responsiveProp(rowSpan, (value, prefix) => `${prefix}row-span-${value}`),
        responsiveProp(rowStart, (value, prefix) => `${prefix}row-start-${value}`),
        responsiveProp(rowEnd, (value, prefix) => `${prefix}row-end-${value}`)
      ],
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
