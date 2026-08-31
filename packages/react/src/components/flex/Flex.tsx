import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { buildResponsiveClassNames } from '../../utils/breakpoints'
import { spacingClassName } from '../../utils/spacingClassName'
import { Breakpoint, Spacing } from '../../types'

export interface FlexLayout {
  /**
   * Sets `flex-direction`. Omit for the browser default (`row`).
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  /**
   * Sets `flex-wrap`. Omit for the browser default (`nowrap`).
   */
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  /**
   * Sets `justify-content`, aligning items along the main axis.
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  /**
   * Sets `align-items`, aligning items along the cross axis.
   */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /**
   * Sets `align-content`, distributing wrapped lines along the cross axis. Has no effect on
   * single-line (non-wrapping) containers.
   */
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
  /**
   * Spacing between children on both axes, mapped to the `gap-*` utility classes. Overridden per
   * axis by `rowGap`/`columnGap` where set.
   */
  gap?: Spacing | 0
  /**
   * Spacing between rows (the cross axis when wrapped), mapped to the `row-gap-*` utility
   * classes. Independent of `gap`/`columnGap`.
   */
  rowGap?: Spacing | 0
  /**
   * Spacing between columns (the main axis), mapped to the `column-gap-*` utility classes.
   * Independent of `gap`/`rowGap`.
   */
  columnGap?: Spacing | 0
}

type FlexOwnProps<C extends ElementType> = FlexLayout & {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Renders an inline flex container (`.d-inline-flex`) instead of a block-level one (`.d-flex`,
   * the default).
   */
  inline?: boolean
  /**
   * Overrides any of `direction`/`wrap`/`justify`/`align`/`alignContent`/`gap`/`rowGap`/
   * `columnGap` at one or more breakpoints, via regular viewport media queries (unlike `Stack`'s
   * `responsive` prop, this doesn't require a `.contains-inline` ancestor).
   */
  responsive?: Partial<Record<Breakpoint, FlexLayout>>
}

export type FlexProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, FlexOwnProps<C>>

type FlexComponent = (<C extends ElementType = 'div'>(
  props: FlexProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

const layoutClassNames = (
  { direction, wrap, justify, align, alignContent, gap, rowGap, columnGap }: FlexLayout,
  prefix: string
) => [
  direction && `${prefix}flex-${direction}`,
  wrap && `${prefix}flex-${wrap}`,
  justify && `${prefix}justify-content-${justify}`,
  align && `${prefix}align-items-${align}`,
  alignContent && `${prefix}align-content-${alignContent}`,
  spacingClassName('gap', gap, prefix),
  spacingClassName('row-gap', rowGap, prefix),
  spacingClassName('column-gap', columnGap, prefix)
]

function FlexRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    component,
    inline,
    direction,
    wrap,
    justify,
    align,
    alignContent,
    gap,
    rowGap,
    columnGap,
    responsive,
    ...rest
  }: FlexProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    inline ? 'd-inline-flex' : 'd-flex',
    buildResponsiveClassNames(
      layoutClassNames,
      { direction, wrap, justify, align, alignContent, gap, rowGap, columnGap },
      responsive
    ),
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const Flex = createPolymorphicComponent<FlexComponent>(
  FlexRender as ForwardRefRenderFunction<Element, FlexProps<ElementType>>,
  'Flex'
)
