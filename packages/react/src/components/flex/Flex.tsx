import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { BREAKPOINTS } from '../../utils/breakpoints'
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

export interface FlexProps extends HTMLAttributes<HTMLDivElement>, FlexLayout {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
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

const layoutClassNames = (
  { direction, wrap, justify, align, alignContent, gap, rowGap, columnGap }: FlexLayout,
  prefix = ''
) => [
  direction && `${prefix}flex-${direction}`,
  wrap && `${prefix}flex-${wrap}`,
  justify && `${prefix}justify-content-${justify}`,
  align && `${prefix}align-items-${align}`,
  alignContent && `${prefix}align-content-${alignContent}`,
  typeof gap === 'string' || typeof gap === 'number' ? `${prefix}gap-${gap}` : null,
  typeof rowGap === 'string' || typeof rowGap === 'number' ? `${prefix}row-gap-${rowGap}` : null,
  typeof columnGap === 'string' || typeof columnGap === 'number'
    ? `${prefix}column-gap-${columnGap}`
    : null
]

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      className,
      component: Component = 'div',
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
    },
    ref
  ) => {
    const responsiveClassNames = responsive
      ? BREAKPOINTS.filter((bp) => responsive[bp]).flatMap((bp) =>
          layoutClassNames(responsive[bp]!, `${bp}:`)
        )
      : []

    const _className = classNames(
      inline ? 'd-inline-flex' : 'd-flex',
      layoutClassNames({ direction, wrap, justify, align, alignContent, gap, rowGap, columnGap }),
      responsiveClassNames,
      className
    )

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  }
)

Flex.displayName = 'Flex'
