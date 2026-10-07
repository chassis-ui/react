import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { responsiveClassNames, responsiveProp } from '../../utils/breakpoints'
import { spacingClassName } from '../../utils/spacingClassName'
import { Responsive, Spacing } from '../../types'

type FlexOwnProps<C extends ElementType> = {
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
   * Sets `flex-direction`. Omit for the browser default (`row`). An object sets it per
   * breakpoint, `base` being the narrowest width: `{ base: 'column', md: 'row' }`. The
   * breakpoints are widths of the viewport, so unlike `Stack`'s `direction` they need no
   * `.contains-inline` ancestor.
   */
  direction?: Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>
  /**
   * Sets `flex-wrap`. Omit for the browser default (`nowrap`). Takes an object per breakpoint,
   * as `direction` does.
   */
  wrap?: Responsive<'wrap' | 'nowrap' | 'wrap-reverse'>
  /**
   * Sets `justify-content`, aligning items along the main axis. Takes an object per breakpoint,
   * as `direction` does.
   */
  justify?: Responsive<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>
  /**
   * Sets `align-items`, aligning items along the cross axis. Takes an object per breakpoint, as
   * `direction` does.
   */
  align?: Responsive<'start' | 'end' | 'center' | 'baseline' | 'stretch'>
  /**
   * Sets `align-content`, distributing wrapped lines along the cross axis. Has no effect on
   * single-line (non-wrapping) containers. Takes an object per breakpoint, as `direction` does.
   */
  alignContent?: Responsive<'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'>
  /**
   * Spacing between children on both axes, mapped to the `gap-*` utility classes. Overridden per
   * axis by `rowGap`/`columnGap` where set. Takes an object per breakpoint, as `direction` does.
   *
   * @type { Responsive<Spacing | 0> }
   */
  gap?: Responsive<Spacing | 0>
  /**
   * Spacing between rows (the cross axis when wrapped), mapped to the `row-gap-*` utility
   * classes. Independent of `gap`/`columnGap`. Takes an object per breakpoint, as `direction`
   * does.
   *
   * @type { Responsive<Spacing | 0> }
   */
  rowGap?: Responsive<Spacing | 0>
  /**
   * Spacing between columns (the main axis), mapped to the `column-gap-*` utility classes.
   * Independent of `gap`/`rowGap`. Takes an object per breakpoint, as `direction` does.
   *
   * @type { Responsive<Spacing | 0> }
   */
  columnGap?: Responsive<Spacing | 0>
}

export type FlexProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, FlexOwnProps<C>>

type FlexComponent = (<C extends ElementType = 'div'>(
  props: FlexProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

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
    ...rest
  }: FlexProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    inline ? 'd-inline-flex' : 'd-flex',
    responsiveClassNames([
      responsiveProp(direction, (value, prefix) => `${prefix}flex-${value}`),
      responsiveProp(wrap, (value, prefix) => `${prefix}flex-${value}`),
      responsiveProp(justify, (value, prefix) => `${prefix}justify-content-${value}`),
      responsiveProp(align, (value, prefix) => `${prefix}align-items-${value}`),
      responsiveProp(alignContent, (value, prefix) => `${prefix}align-content-${value}`),
      responsiveProp(gap, (value, prefix) => spacingClassName('gap', value, prefix)),
      responsiveProp(rowGap, (value, prefix) => spacingClassName('row-gap', value, prefix)),
      responsiveProp(columnGap, (value, prefix) => spacingClassName('column-gap', value, prefix))
    ]),
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
