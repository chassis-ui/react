import React, {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  ReactElement,
  ReactNode
} from 'react'

import { WidthSpan } from '../../utils/breakpoints'
import { PolymorphicRef } from '../../utils/polymorphic'
import { ContextColor } from '../../types'
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
  spans?: WidthSpan | WidthSpan[]
}

// Spelled out rather than `PolymorphicComponentProps`, which adds `asChild`: `SkeletonLoader`
// renders no element of its own (it swaps its `children` for generated `Skeleton` lines), so
// there's nothing for a child element to stand in for. (`Omit`-ing it from that type instead
// breaks `C`'s inference from `component`.)
export type SkeletonLoaderProps<C extends ElementType = 'span'> = SkeletonLoaderOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof SkeletonLoaderOwnProps<C> | 'asChild'>

type SkeletonLoaderComponent = (<C extends ElementType = 'span'>(
  props: SkeletonLoaderProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

/**
 * A pure content swap: no wrapping element of its own, so `.skeleton-glow`/`.skeleton-wave`
 * won't reach the lines it generates unless applied to a container already in the tree — see
 * `Skeleton`'s own docs for why the animation classes need a `.skeleton` descendant to animate.
 *
 * The ref goes to the first generated skeleton while `loading`, and is `null` once the real
 * content shows: that content is the caller's, with refs of its own.
 */
function SkeletonLoaderRender<C extends ElementType = 'span'>(
  { children, color, component, loading, spans, ...rest }: SkeletonLoaderProps<C>,
  ref: ForwardedRef<Element>
) {
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
            ref={index === 0 ? ref : undefined}
          />
        </Fragment>
      ))}
    </>
  )
}

// `forwardRef` takes a render function that isn't generic, so the generic type is cast back on,
// as `createPolymorphicComponent` does.
export const SkeletonLoader = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SkeletonLoaderRender as ForwardRefRenderFunction<Element, any>
) as unknown as SkeletonLoaderComponent

SkeletonLoader.displayName = 'SkeletonLoader'
