import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { ContextColor } from '../../types'

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
   * Size the component small.
   */
  size?: 'small'
  /**
   * Set the button variant to an outlined button or a ghost button.
   */
  variant?: 'border' | 'grow'
  /**
   * Set visually hidden label for accessibility purposes.
   */
  visuallyHiddenLabel?: string
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
    color ? `fg-${color}` : null,
    size && `spinner-${variant}-${size}`,
    className
  )

  return (
    <Component className={_className} role="status" {...rest} ref={ref}>
      <span className="visually-hidden">{visuallyHiddenLabel}</span>
    </Component>
  )
}

export const Spinner = createPolymorphicComponent<SpinnerComponent>(
  SpinnerRender as ForwardRefRenderFunction<Element, SpinnerProps<ElementType>>,
  'Spinner'
)
