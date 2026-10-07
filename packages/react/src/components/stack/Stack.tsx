import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { baseValue, responsiveClassNames, responsiveProp } from '../../utils/breakpoints'
import { spacingClassName } from '../../utils/spacingClassName'
import { Responsive, Spacing } from '../../types'

const directionClassName = (direction: 'horizontal' | 'vertical', prefix: string) =>
  `${prefix}${direction === 'vertical' ? 'vstack' : 'hstack'}`

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
   * (`vertical`, maps to `.vstack`). An object switches the direction from a breakpoint up:
   * `{ base: 'vertical', md: 'horizontal' }`. The breakpoints are container queries, so they
   * require a `.contains-inline` ancestor (not applied by `Stack` itself — see the docs) to
   * establish the container context they evaluate against.
   */
  direction?: Responsive<'horizontal' | 'vertical'>
  /**
   * Spacing between children, mapped to the `gap-*` utility classes.
   *
   * @type { Spacing | 0 }
   */
  gap?: Spacing | 0
}

export type StackProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  StackOwnProps<C>
>

type StackComponent = (<C extends ElementType = 'div'>(
  props: StackProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function StackRender<C extends ElementType = 'div'>(
  { children, className, component, direction = 'horizontal', gap, ...rest }: StackProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    // An object with no `base` still starts from the default direction.
    baseValue(direction) === undefined && 'hstack',
    responsiveClassNames([responsiveProp(direction, directionClassName)]),
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
