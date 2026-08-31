import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ProgressBarOwnProps<C extends ElementType> = {
  /**
   * Use to animate the stripes right to left via CSS3 animations.
   */
  animated?: boolean
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
   * Adds a diagonal stripe pattern over the bar's background.
   */
  striped?: boolean
  /**
   * The percent to progress the ProgressBar.
   */
  value?: number
}

export type ProgressBarProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ProgressBarOwnProps<C>
>

type ProgressBarComponent = (<C extends ElementType = 'div'>(
  props: ProgressBarProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ProgressBarRender<C extends ElementType = 'div'>(
  {
    children,
    animated,
    className,
    color,
    component,
    striped,
    style,
    value = 0,
    ...rest
  }: ProgressBarProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const clampedValue = Math.min(100, Math.max(0, value))
  const _className = classNames(
    'progress-bar',
    color && `bg-${color} fg-contrast`,
    {
      striped,
      animated
    },
    className
  )

  return (
    <Component
      {...rest}
      className={_className}
      style={{ width: `${clampedValue}%`, ...style }}
      ref={ref}
    >
      <span className="mx-2xsmall">{children}</span>
    </Component>
  )
}

export const ProgressBar = createPolymorphicComponent<ProgressBarComponent>(
  ProgressBarRender as ForwardRefRenderFunction<Element, ProgressBarProps<ElementType>>,
  'ProgressBar'
)
