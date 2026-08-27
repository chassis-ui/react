import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor, ContextStyle } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type PlaceholderAlign = 'start' | 'center' | 'end'

type PlaceholderOwnProps<C extends ElementType> = {
  /**
   * Set the horizontal alignment. Only applies when `src` is set.
   */
  align?: PlaceholderAlign
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the generated placeholder graphic to one of Chassis context colors. Has no
   * effect when `src` is set.
   */
  color?: ContextColor
  /**
   * Sets the variant of the generated placeholder graphic to one of Chassis context styles. Has no
   * effect when `src` is set.
   */
  variant?: Exclude<ContextStyle, 'basic' | 'outline'>
  /**
   * Component used for the root node when `src` is set. Either a string to use an HTML element
   * or a component — e.g. a framework's own `Image` component. Its own props (`src`, `fill`,
   * `priority`, etc.) are type-checked at the call site once passed here.
   */
  component?: C
  /**
   * Make the image responsive, so it never grows larger than its parent. Only applies when `src`
   * is set.
   */
  fluid?: boolean
  /**
   * Placeholder height.
   */
  height?: number | string
  /**
   * Give the image a rounded border-radius. Only applies when `src` is set.
   */
  rounded?: boolean
  /**
   * Renders a real image instead of the generated placeholder graphic, e.g. a default asset or a
   * `placehold.co` URL.
   */
  src?: string
  /**
   * Text shown in the generated placeholder graphic. Defaults to `{width}x{height}`. Pass `false`
   * to hide it. Has no effect when `src` is set.
   */
  text?: string | false
  /**
   * Give the image a thumbnail appearance (padding, background, border, box-shadow). Only
   * applies when `src` is set.
   */
  thumbnail?: boolean
  /**
   * Accessible title for the generated placeholder graphic, rendered as an SVG `<title>`. Pass
   * `false` to hide it. Has no effect when `src` is set.
   *
   * @default 'Placeholder'
   */
  title?: string | false
  /**
   * Placeholder width.
   */
  width?: number | string
}

export type PlaceholderProps<C extends ElementType = 'img'> = PolymorphicComponentProps<
  C,
  PlaceholderOwnProps<C>
>

type PlaceholderComponent = (<C extends ElementType = 'img'>(
  props: PlaceholderProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

const alignClassNames = (align: PlaceholderAlign | undefined) => [
  align === 'start' || align === 'end' ? `float-${align}` : null,
  align === 'center' ? 'd-block mx-auto' : null
]

function PlaceholderRender<C extends ElementType = 'img'>(
  {
    align,
    alt,
    className,
    color,
    component,
    fluid,
    height,
    rounded,
    src,
    text,
    thumbnail,
    title = 'Placeholder',
    variant,
    width,
    ...rest
  }: PlaceholderProps<C>,
  ref: PolymorphicRef<C>
) {
  const showTitle = title !== false
  const displayText =
    text === false
      ? undefined
      : (text ?? (width !== undefined && height !== undefined ? `${width}x${height}` : undefined))
  const showText = displayText !== undefined
  const label =
    [showTitle && title, showText && displayText].filter(Boolean).join(': ') || undefined

  if (src) {
    const Component = component ?? 'img'
    const _className = classNames(
      { image: fluid || thumbnail, fluid, rounded, thumbnail },
      alignClassNames(align),
      className
    )

    return (
      <Component
        src={src}
        width={width}
        height={height}
        alt={alt ?? label ?? ''}
        className={_className}
        {...rest}
        ref={ref}
      />
    )
  }

  const _className = classNames(
    'image',
    { context: Boolean(color || variant) },
    color,
    variant ? variant : 'bg-evident',
    'fg-subtle',
    className
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={_className}
      preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : undefined}
      {...rest}
      ref={ref as PolymorphicRef<'svg'>}
    >
      {showTitle && <title>{title}</title>}
      {showText && (
        <text dy=".3em" fill="currentColor" textAnchor="middle" x="50%" y="50%">
          {displayText}
        </text>
      )}
    </svg>
  )
}

export const Placeholder = createPolymorphicComponent<PlaceholderComponent>(
  PlaceholderRender as ForwardRefRenderFunction<Element, PlaceholderProps<ElementType>>,
  'Placeholder'
)
