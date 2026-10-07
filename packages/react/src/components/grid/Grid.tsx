import React, { CSSProperties, ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import {
  baseValue,
  GRID_BREAKPOINTS,
  responsiveClassNames,
  responsiveProp
} from '../../utils/breakpoints'
import { Breakpoint, ContainerBreakpoint, Responsive, Spacing } from '../../types'
import { gapClassName, gapValue } from './gap'
import { hasRowsClass, rowsTemplate } from './rows'

type GridStyle = CSSProperties & {
  '--cx-grid-columns'?: number
  '--cx-grid-gap'?: string
  '--cx-grid-min'?: string
}

/**
 * The direction a grid places its items in, and whether it fills earlier gaps (`dense`): the
 * values of CSS `grid-auto-flow`.
 */
export type GridFlow = 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'

// A token is a class at any width. A raw CSS value is a custom property, which only the base
// can be: an inline style holds no media query.
type GridGap = Spacing | (string & {})

type GridOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Number of columns in the grid template (the column count of `@chassis-ui/css` when omitted,
   * `12` by default). A count from 1 to 12 is mapped to the `grid-cols-{n}` class, which applies
   * to this grid alone. Any other count has no class and is set via the `--cx-grid-columns`
   * custom property, which a grid nested in this one inherits: give that grid `columns` of its
   * own. Has no effect when `fill` is set.
   *
   * An object sets the count from a width up, as in `{ base: 1, md: 3 }`, here and on `rows`,
   * `gap` and `flow`. A breakpoint key (`md`) is a width of the viewport. A container key
   * (`'@md'`) is the same width of the nearest query container (an ancestor with the
   * `contains-inline` class), and wins over a breakpoint key where both apply. Without a query
   * container above the grid, a container key never applies. The count of a key is a class, so
   * a count from 1 to 12.
   */
  columns?: Responsive<number, Breakpoint | ContainerBreakpoint>
  /**
   * Number of equal rows in the grid template. A grid has none when omitted: its rows are as
   * tall as their content. A count from 1 to 6 is mapped to the `grid-rows-{n}` class; any other
   * count has no class and is set inline, as the `grid-template-rows` the class declares. Has no
   * effect when `fill` is set. An object sets the count from a width up, where it is a class, so
   * a count from 1 to 6.
   */
  rows?: Responsive<number, Breakpoint | ContainerBreakpoint>
  /**
   * Gap between grid items: a `Spacing` token (mapped to the `gap-{token}` class) or any raw CSS
   * `gap` value, including a `"{row} {column}"` pair (set via the `--cx-grid-gap` custom
   * property). The gutter of the current breakpoint when omitted, or of the query container when
   * `contained` is set. An object sets the gap from a width up: only a token fits a key other
   * than `base`, since a raw value has no class.
   *
   * @type { Spacing | string | { base?: Spacing | string } & Partial<Record<Breakpoint | ContainerBreakpoint, Spacing>> }
   */
  gap?: GridGap | ({ base?: GridGap } & Partial<Record<Breakpoint | ContainerBreakpoint, Spacing>>)
  /**
   * The direction items are placed in, mapped to the `grid-flow-*` classes: by `'row'` (the CSS
   * default) or by `'column'`, which fills the `rows` of one column before it starts the next.
   * `'dense'`, `'row-dense'` and `'column-dense'` also move later items into gaps that earlier,
   * wider ones left. An object sets the flow from a width up.
   */
  flow?: Responsive<GridFlow, Breakpoint | ContainerBreakpoint>
  /**
   * Adds the `contained` class: the default gutter and column count follow the width of the
   * nearest query container instead of the viewport, so a grid in a narrow column of a wide page
   * has the gutter of a narrow page. Without a query container above it the grid keeps the
   * values of the viewport. `columns` and `gap` still override them.
   */
  contained?: boolean
  /**
   * Renders `.grid-fill` instead of `.grid` — columns expand equally to fill the available
   * width, with the column count determined by the number of children rather than `columns`.
   */
  fill?: boolean
  /**
   * Minimum column width of a `fill` grid, set via the `--cx-grid-min` custom property: any CSS
   * length, e.g. `"16rem"`. Children wrap to a new row when they would get narrower. `12rem` in
   * `@chassis-ui/css` when omitted. Only relevant when `fill` is set.
   */
  min?: string
}

export type GridProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, GridOwnProps<C>>

// chassis-css has `grid-cols-1` to `grid-cols-12`.
const hasColumnsClass = (columns: number | undefined) =>
  columns !== undefined && Number.isInteger(columns) && columns >= 1 && columns <= 12

// chassis-css names the values as Tailwind does: `grid-flow-col`, `grid-flow-col-dense`.
const flowClassName = (flow: GridFlow, prefix: string) =>
  `${prefix}grid-flow-${flow.replace('column', 'col')}`

type GridComponent = (<C extends ElementType = 'div'>(
  props: GridProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function GridRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    component,
    columns,
    rows,
    gap,
    flow,
    contained,
    fill,
    min,
    style,
    ...rest
  }: GridProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'

  // A class where chassis-css has one: `--cx-grid-columns` set inline is inherited by every grid
  // nested in this one, which then has this grid's column count instead of its own. Only a base
  // count with no class falls back to the property; a breakpoint's can't, since an inline style
  // holds no media query. `.grid-fill` counts its own columns. A base row count with no class is
  // set inline too, as a declaration: see `rowsTemplate`.
  const baseColumns = baseValue(columns)
  const baseRows = baseValue(rows)
  const baseGap = baseValue<string>(gap)

  const _className = classNames(
    fill ? 'grid-fill' : 'grid',
    contained && 'contained',
    responsiveClassNames(
      [
        responsiveProp(
          columns,
          (value, prefix) =>
            !fill && (prefix !== '' || hasColumnsClass(value)) && `${prefix}grid-cols-${value}`
        ),
        responsiveProp(
          rows,
          (value, prefix) =>
            !fill && (prefix !== '' || hasRowsClass(value)) && `${prefix}grid-rows-${value}`
        ),
        responsiveProp<string>(gap, gapClassName),
        responsiveProp(flow, flowClassName)
      ],
      GRID_BREAKPOINTS
    ),
    className
  )

  const _style: GridStyle = { ...style }
  const _gap = gapValue(baseGap)

  if (_gap !== undefined) _style['--cx-grid-gap'] = _gap

  if (fill) {
    if (min !== undefined) _style['--cx-grid-min'] = min
  } else {
    if (baseColumns !== undefined && !hasColumnsClass(baseColumns)) {
      _style['--cx-grid-columns'] = baseColumns
    }
    const _rows = rowsTemplate(baseRows)
    if (_rows !== undefined) _style.gridTemplateRows = _rows
  }

  return (
    <Component className={_className} style={_style} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const Grid = createPolymorphicComponent<GridComponent>(
  GridRender as ForwardRefRenderFunction<Element, GridProps<ElementType>>,
  'Grid'
)
