import React, { ElementType, Fragment, ReactElement, ReactNode } from 'react'

import { Span } from '../../utils/breakpoints'
import { ContextColor } from '../../types'
import { PolymorphicComponentProps } from '../../utils/polymorphic'
import { Skeleton, SkeletonProps } from './Skeleton'

type SkeletonLoaderOwnProps<C extends ElementType> = {
  /**
   * The real content, rendered unchanged (no wrapping element) once `loading` is `false`.
   */
  children: ReactNode
  /**
   * Sets the color of the generated skeleton lines to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the generated skeleton(s) — e.g. `Avatar` or `Button` — for swapping
   * non-text content, not just text runs. Its own props are type-checked at the call site once
   * passed here, same as `Skeleton`'s own `component` prop.
   *
   * @default 'span'
   */
  component?: C
  /**
   * Swaps `children` for one `<Skeleton>` per entry in `spans` while `true`.
   */
  loading: boolean
  /**
   * One skeleton line per entry, using the same values as `Skeleton`'s `span` prop — e.g.
   * `[12, 6]` for a full-width line followed by a half-width one. A single value (e.g. `6`) is
   * shorthand for a single line, equivalent to `[6]`. Leave unset for a single skeleton sized by
   * `component`'s own intrinsic width instead — e.g. an `Avatar`'s `size` prop. Rendered instead
   * of `children` while `loading` is `true`; ignored once `loading` is `false`.
   *
   * @type { 'auto' | number | string | boolean | Array<'auto' | number | string | boolean> }
   */
  spans?: Span | Span[]
}

export type SkeletonLoaderProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  SkeletonLoaderOwnProps<C>
>

type SkeletonLoaderComponent = (<C extends ElementType = 'span'>(
  props: SkeletonLoaderProps<C>
) => ReactElement | null) & { displayName?: string }

/**
 * A pure content swap: no wrapping element of its own, so `.skeleton-glow`/`.skeleton-wave`
 * won't reach the lines it generates unless applied to a container already in the tree — see
 * `Skeleton`'s own docs for why the animation classes need a `.skeleton` descendant to animate.
 */
function SkeletonLoaderRender<C extends ElementType = 'span'>({
  children,
  color,
  component,
  loading,
  spans,
  ...rest
}: SkeletonLoaderProps<C>) {
  if (!loading) return <>{children}</>

  const spanList = spans === undefined ? [undefined] : Array.isArray(spans) ? spans : [spans]

  return (
    <>
      {spanList.map((span, index) => (
        // eslint-disable-next-line react/no-array-index-key -- `spans` is a static prop array
        <Fragment key={index}>
          {index > 0 && ' '}
          {/* `rest` is `C`'s own props minus `SkeletonLoaderOwnProps`'s keys, which structurally
              satisfies what `Skeleton<C>` wants (`C`'s own props minus its own, different, key
              set) — TS can't verify that across two independently-generic components, hence the
              cast. */}
          <Skeleton
            component={component}
            span={span}
            color={color}
            {...(rest as unknown as SkeletonProps<C>)}
          />
        </Fragment>
      ))}
    </>
  )
}

export const SkeletonLoader = SkeletonLoaderRender as SkeletonLoaderComponent

SkeletonLoader.displayName = 'SkeletonLoader'
