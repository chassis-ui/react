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

const directionClassName = (direction: 'horizontal' | 'vertical', prefix: string) => [
  `${prefix}${direction === 'vertical' ? 'vstack' : 'hstack'}`
]

type StackOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Lays children out in a row (`horizontal`, the default, maps to `.hstack`) or a column
   * (`vertical`, maps to `.vstack`).
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * Spacing between children, mapped to the `gap-*` utility classes.
   */
  gap?: Spacing | 0
  /**
   * Switches `direction` at one or more breakpoints via container queries. Requires a
   * `.contains-inline` ancestor (not applied by `Stack` itself — see the docs) to establish the
   * container context these queries evaluate against.
   */
  responsive?: Partial<Record<Breakpoint, 'horizontal' | 'vertical'>>
}

export type StackProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  StackOwnProps<C>
>

type StackComponent = (<C extends ElementType = 'div'>(
  props: StackProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function StackRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    component,
    direction = 'horizontal',
    gap,
    responsive,
    ...rest
  }: StackProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    buildResponsiveClassNames(directionClassName, direction, responsive),
    spacingClassName('gap', gap),
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const Stack = createPolymorphicComponent<StackComponent>(
  StackRender as ForwardRefRenderFunction<Element, StackProps<ElementType>>,
  'Stack'
)
