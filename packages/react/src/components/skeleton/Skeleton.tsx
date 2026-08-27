import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { Span, buildResponsiveClassNames } from '../../utils/breakpoints'
import { Breakpoint, ContextColor } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type SkeletonOwnProps<C extends ElementType> = {
  /**
   * Adds `skeleton-{animation}` alongside the base `skeleton` class, so the element animates
   * itself as well as any nested `<Skeleton>` children. Nest plain `<Skeleton>` children inside
   * it for the glow pulse to reach them too, or apply `wave` to a container of one or more
   * `<Skeleton>` children for a directional sweep across the whole group.
   */
  animation?: 'glow' | 'wave'
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use an HTML element or a component —
   * e.g. `Avatar` or `Button`. Its own props are type-checked at the call site once passed here.
   *
   * @default 'span'
   */
  component?: C
  /**
   * Width of the skeleton, expressed as a column span (of 12), or `'auto'`/`true` for a
   * natural-width skeleton. Unset by default, so the rendered element's own intrinsic width
   * applies — set it explicitly (e.g. `span={12}`) for a full-width text line; leave it unset
   * when `component` is something that sizes itself, like `Avatar` or `Button`.
   *
   * @type { 'auto' | number | string | boolean }
   */
  span?: Span
  /**
   * Overrides `span` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', 'auto' | number | string | boolean>> }
   */
  responsive?: Partial<Record<Breakpoint, Span>>
}

export type SkeletonProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  SkeletonOwnProps<C>
>

type SkeletonComponent = (<C extends ElementType = 'span'>(
  props: SkeletonProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

const spanClassNames = (span: Span | undefined, prefix: string) => [
  typeof span === 'number' || typeof span === 'string' ? `${prefix}col-${span}` : null,
  span === true ? `${prefix}col` : null
]

function SkeletonRender<C extends ElementType = 'span'>(
  { children, animation, className, color, component, span, responsive, ...rest }: SkeletonProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'span'
  const _className = classNames(
    'skeleton',
    animation && `skeleton-${animation}`,
    { [`bg-${color}`]: color },
    buildResponsiveClassNames(spanClassNames, span, responsive),
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const Skeleton = createPolymorphicComponent<SkeletonComponent>(
  SkeletonRender as ForwardRefRenderFunction<Element, SkeletonProps<ElementType>>,
  'Skeleton'
)
