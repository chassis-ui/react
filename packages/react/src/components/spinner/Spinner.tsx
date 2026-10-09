import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { ContextColor } from '../../types'
import { FG_COLOR_CLASS_NAMES } from '../../utils/colorClassNames'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'

type SpinnerOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Renders a smaller spinner, with the `spinner-sm` class.
   */
  size?: 'sm'
  /**
   * Set the button variant to an outlined button or a ghost button.
   */
  variant?: 'border' | 'grow'
  /**
   * Set visually hidden label for accessibility purposes.
   */
  visuallyHiddenLabel?: string
}

// chassis-css sizes a spinner of either variant with the one `spinner-{size}` class. Whole class
// names: see `utils/colorClassNames.ts`.
const SIZE_CLASS_NAMES: Record<NonNullable<SpinnerOwnProps<ElementType>['size']>, string> = {
  sm: 'spinner-sm'
}

export type SpinnerProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  SpinnerOwnProps<C>
>

type SpinnerComponent = (<C extends ElementType = 'div'>(
  props: SpinnerProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function SpinnerRender<C extends ElementType = 'div'>(
  {
    className,
    color,
    component,
    size,
    variant = 'border',
    visuallyHiddenLabel = 'Loading...',
    ...rest
  }: SpinnerProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    `spinner-${variant}`,
    color ? FG_COLOR_CLASS_NAMES[color] : null,
    size && SIZE_CLASS_NAMES[size],
    className
  )

  return (
    <Component className={_className} role="status" {...rest} ref={ref}>
      <VisuallyHidden>{visuallyHiddenLabel}</VisuallyHidden>
    </Component>
  )
}

export const Spinner = createPolymorphicComponent<SpinnerComponent>(
  SpinnerRender as ForwardRefRenderFunction<Element, SpinnerProps<ElementType>>,
  'Spinner'
)
