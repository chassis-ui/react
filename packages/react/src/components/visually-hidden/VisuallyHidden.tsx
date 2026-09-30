import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type VisuallyHiddenOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'span'
   */
  component?: C
  /**
   * Shows the element while it, or an element inside it, has keyboard focus: a skip link, or a
   * group of controls only keyboard users reach. Renders `.visually-hidden-focusable` instead of
   * `.visually-hidden`.
   */
  focusable?: boolean
}

export type VisuallyHiddenProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  VisuallyHiddenOwnProps<C>
>

type VisuallyHiddenComponent = (<C extends ElementType = 'span'>(
  props: VisuallyHiddenProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function VisuallyHiddenRender<C extends ElementType = 'span'>(
  { children, className, component, focusable, ...rest }: VisuallyHiddenProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'span'

  return (
    <Component
      className={classNames(focusable ? 'visually-hidden-focusable' : 'visually-hidden', className)}
      {...rest}
      ref={ref}
    >
      {children}
    </Component>
  )
}

export const VisuallyHidden = createPolymorphicComponent<VisuallyHiddenComponent>(
  VisuallyHiddenRender as ForwardRefRenderFunction<Element, VisuallyHiddenProps<ElementType>>,
  'VisuallyHidden'
)
