import React, { CSSProperties, ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { Spacing } from '../../types'
import { resolveGap } from './gap'

type GridStyle = CSSProperties & {
  '--cx-grid-columns'?: number
  '--cx-grid-rows'?: number
  '--cx-grid-gap'?: string
  '--cx-gap'?: string
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
   * Number of columns in the grid template, set via the `--cx-grid-columns` custom property
   * (defaults to `12` in CSS when omitted). Has no effect when `fill` is set.
   */
  columns?: number
  /**
   * Number of rows in the grid template, set via the `--cx-grid-rows` custom property (defaults
   * to `1` in CSS when omitted). Has no effect when `fill` is set.
   */
  rows?: number
  /**
   * Gap between grid items, set via the `--cx-grid-gap` custom property (or `--cx-gap` when
   * `fill` is set). Accepts a `Spacing` token (mapped to the matching `--cx-space-*` custom
   * property) or any raw CSS `gap` value, including a `"{row} {column}"` pair.
   *
   * @type { Spacing | string }
   */
  gap?: Spacing | (string & {})
  /**
   * Renders `.grid-fill` instead of `.grid` — columns expand equally to fill the available
   * width, with the column count determined by the number of children rather than `columns`.
   */
  fill?: boolean
}

export type GridProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, GridOwnProps<C>>

type GridComponent = (<C extends ElementType = 'div'>(
  props: GridProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function GridRender<C extends ElementType = 'div'>(
  { children, className, component, columns, rows, gap, fill, style, ...rest }: GridProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(fill ? 'grid-fill' : 'grid', className)

  const _style: GridStyle = { ...style }

  if (fill) {
    if (gap !== undefined) _style['--cx-gap'] = resolveGap(gap)
  } else {
    if (columns !== undefined) _style['--cx-grid-columns'] = columns
    if (rows !== undefined) _style['--cx-grid-rows'] = rows
    if (gap !== undefined) _style['--cx-grid-gap'] = resolveGap(gap)
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
