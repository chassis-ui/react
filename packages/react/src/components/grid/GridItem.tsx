import React, { CSSProperties, ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { buildResponsiveClassNames } from '../../utils/breakpoints'
import { Breakpoint, Spacing } from '../../types'
import { resolveGap } from './gap'

type GridItemStyle = CSSProperties & {
  '--cx-grid-rows'?: number
  '--cx-grid-gap'?: string
}

export interface GridItemLayout {
  /**
   * Number of grid column tracks (of the parent `<Grid>`'s `columns`) this item spans, mapped to
   * the `g-col-{n}` class.
   */
  span?: number
  /**
   * Grid column line to start this item at, mapped to the `g-start-{n}` class.
   */
  start?: number
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
   * Overrides `span`/`start` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', { span?: number, start?: number }>> }
   */
  responsive?: Partial<Record<Breakpoint, GridItemLayout>>
  /**
   * Turns this item into a nested subgrid: adds `.grid`/`.grid-cols-subgrid` alongside its
   * `g-col-{n}`/`g-start-{n}` placement classes, so its own children inherit the parent
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
   * Gap between the subgrid's children, set via the `--cx-grid-gap` custom property. Only
   * relevant when `subgrid` is set — a subgrid doesn't inherit its parent's gap.
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

const layoutClassNames = ({ span, start }: GridItemLayout, prefix: string) => [
  typeof span === 'number' ? `${prefix}g-col-${span}` : null,
  typeof start === 'number' ? `${prefix}g-start-${start}` : null
]

function GridItemRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    component,
    span,
    start,
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
    buildResponsiveClassNames(layoutClassNames, { span, start }, responsive),
    subgrid && 'grid grid-cols-subgrid',
    className
  )

  const _style: GridItemStyle = { ...style }

  if (subgrid) {
    if (rows !== undefined) _style['--cx-grid-rows'] = rows
    if (gap !== undefined) _style['--cx-grid-gap'] = resolveGap(gap)
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
