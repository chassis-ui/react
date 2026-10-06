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

type GridStyle = CSSProperties & {
  '--cx-grid-columns'?: number
  '--cx-grid-rows'?: number
  '--cx-grid-gap'?: string
  '--cx-grid-min'?: string
}

export interface GridLayout {
  /**
   * Number of columns in the grid template from this breakpoint up, mapped to the
   * `grid-cols-{n}` class (1 to 12). Has no effect when `fill` is set.
   */
  columns?: number
  /**
   * Gap between grid items from this breakpoint up, mapped to the `gap-{token}` class.
   */
  gap?: Spacing
}

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
   */
  columns?: number
  /**
   * Number of rows in the grid template, set via the `--cx-grid-rows` custom property (defaults
   * to `1` in CSS when omitted). Has no effect when `fill` is set.
   */
  rows?: number
  /**
   * Gap between grid items: a `Spacing` token (mapped to the `gap-{token}` class) or any raw CSS
   * `gap` value, including a `"{row} {column}"` pair (set via the `--cx-grid-gap` custom
   * property). The gutter of the current breakpoint when omitted.
   *
   * @type { Spacing | string }
   */
  gap?: Spacing | (string & {})
  /**
   * Overrides `columns`/`gap` at a breakpoint and up, with the `grid-cols-{n}` and `gap-{token}`
   * classes.
   *
   * @type { Partial<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', { columns?: number, gap?: Spacing }>> }
   */
  responsive?: Partial<Record<Breakpoint, GridLayout>>
  /**
   * Renders `.grid-fill` instead of `.grid` — columns expand equally to fill the available
   * width, with the column count determined by the number of children rather than `columns`.
   */
  fill?: boolean
  /**
   * Minimum column width of a `fill` grid, set via the `--cx-grid-min` custom property: any CSS
   * length, e.g. `"12rem"`. Children wrap to a new row when they would get narrower. Only
   * relevant when `fill` is set.
   */
  min?: string
}

export type GridProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, GridOwnProps<C>>

// chassis-css has `grid-cols-1` to `grid-cols-12`.
const hasColumnsClass = (columns: number | undefined) =>
  columns !== undefined && Number.isInteger(columns) && columns >= 1 && columns <= 12

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
    responsive,
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
  // holds no media query. `.grid-fill` counts its own columns.
  const columnsClass = hasColumnsClass(columns)

  const layoutClassNames = (
    { columns, gap }: { columns?: number; gap?: string },
    prefix: string
  ) => [
    !fill && columns !== undefined && `${prefix}grid-cols-${columns}`,
    gapClassName(gap, prefix)
  ]

  const _className = classNames(
    fill ? 'grid-fill' : 'grid',
    buildResponsiveClassNames(
      layoutClassNames,
      { columns: columnsClass ? columns : undefined, gap },
      responsive
    ),
    className
  )

  const _style: GridStyle = { ...style }
  const _gap = gapValue(gap)

  if (_gap !== undefined) _style['--cx-grid-gap'] = _gap

  if (fill) {
    if (min !== undefined) _style['--cx-grid-min'] = min
  } else {
    if (columns !== undefined && !columnsClass) _style['--cx-grid-columns'] = columns
    if (rows !== undefined) _style['--cx-grid-rows'] = rows
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
