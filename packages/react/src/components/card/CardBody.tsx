import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { Breakpoint, Spacing } from '../../types'
import {
  buildResponsiveClassNames,
  flexDirectionClassNames,
  FlexDirection
} from '../../utils/breakpoints'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { spacingClassName } from '../../utils/spacingClassName'

type CardBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Switches the body from its default stacked (column) layout to a side-by-side (row) layout —
   * for placing an image beside text within a single padded region. Wrap the image and text in
   * `Col` to control each side's width, and nest another `CardBody` (with `.p-0`) for the text
   * side so it doesn't receive double padding.
   */
  direction?: FlexDirection
  /**
   * Spacing between children, mapped to the `gap-*` utility classes. Overrides the card's default
   * gap between body children.
   */
  gap?: Spacing | 0
  /**
   * Overrides `direction` at one or more breakpoints.
   */
  responsive?: Partial<Record<Breakpoint, FlexDirection>>
}

export type CardBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  CardBodyOwnProps<C>
>

type CardBodyComponent = (<C extends ElementType = 'div'>(
  props: CardBodyProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function CardBodyRender<C extends ElementType = 'div'>(
  { children, className, component, direction, gap, responsive, ...rest }: CardBodyProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    'card-body',
    buildResponsiveClassNames(flexDirectionClassNames, direction, responsive),
    spacingClassName('gap', gap),
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const CardBody = createPolymorphicComponent<CardBodyComponent>(
  CardBodyRender as ForwardRefRenderFunction<Element, CardBodyProps<ElementType>>,
  'CardBody'
)
