import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { Breakpoint } from '../../types'
import { buildResponsiveClassNames } from '../../utils/breakpoints'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type CardImageOrientation = 'top' | 'bottom' | 'start' | 'end'

type CardImageOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component —
   * e.g. a framework's own `Image` component. Its own props (`src`, `fill`, `priority`, etc.)
   * are type-checked at the call site once passed here.
   */
  component?: C
  /**
   * Orientates the image to the top or bottom of the card as an "image cap", or to the start/end
   * for a horizontal layout. Omit to round all four corners for use inside `CardBody`.
   */
  orientation?: CardImageOrientation
  /**
   * Overrides `orientation` at one or more breakpoints — e.g. `{ large: 'start' }` to switch an
   * image cap from `top` to `start` once the card lays out horizontally.
   */
  responsive?: Partial<Record<Breakpoint, CardImageOrientation>>
}

export type CardImageProps<C extends ElementType = 'img'> = PolymorphicComponentProps<
  C,
  CardImageOwnProps<C>
>

type CardImageComponent = (<C extends ElementType = 'img'>(
  props: CardImageProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

const layoutClassNames = (orientation: CardImageOrientation | undefined, prefix: string) => [
  orientation ? `${prefix}card-image-${orientation}` : prefix === '' ? 'card-image' : null
]

function CardImageRender<C extends ElementType = 'img'>(
  { children, className, component, orientation, responsive, ...rest }: CardImageProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'img'
  const _className = classNames(
    buildResponsiveClassNames(layoutClassNames, orientation, responsive),
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardImage = createPolymorphicComponent<CardImageComponent>(
  CardImageRender as ForwardRefRenderFunction<Element, CardImageProps<ElementType>>,
  'CardImage'
)
