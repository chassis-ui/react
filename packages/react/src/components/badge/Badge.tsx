import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor, ContextStyle, Sizing } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type BadgeOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Sets the context style of the component. `solid`/`basic` render the default look with no extra class.
   */
  variant?: ContextStyle
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Position badge in one of the corners of a link or button.
   */
  position?: 'top-start' | 'top-end' | 'bottom-end' | 'bottom-start'
  /**
   * Select the shape of the component.
   */
  circle?: boolean
  /**
   * Sets the size of the component to one of Chassis component sizes.
   */
  size?: Sizing
}

export type BadgeProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  BadgeOwnProps<C>
>

type BadgeComponent = (<C extends ElementType = 'span'>(
  props: BadgeProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function BadgeRender<C extends ElementType = 'span'>(
  {
    children,
    className,
    color,
    variant,
    component,
    position,
    circle,
    size,
    ...rest
  }: BadgeProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'span'

  const _className = classNames(
    'badge',
    color,
    size,
    {
      outline: variant === 'outline',
      smooth: variant === 'smooth',
      'position-absolute translate-middle': position,
      'top-0': position?.includes('top'),
      'top-100': position?.includes('bottom'),
      'start-100': position?.includes('end'),
      'start-0': position?.includes('start')
    },
    { circle },
    className
  )

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const Badge = createPolymorphicComponent<BadgeComponent>(
  BadgeRender as ForwardRefRenderFunction<Element, BadgeProps<ElementType>>,
  'Badge'
)
