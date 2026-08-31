import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type StepperItemOwnProps<C extends ElementType> = {
  /**
   * Marks the item as the current step.
   */
  active?: boolean
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
   * The `href` attribute for an interactive step rendered as a link.
   */
  href?: string
}

export type StepperItemProps<C extends ElementType = 'li'> = PolymorphicComponentProps<
  C,
  StepperItemOwnProps<C>
>

type StepperItemComponent = (<C extends ElementType = 'li'>(
  props: StepperItemProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function StepperItemRender<C extends ElementType = 'li'>(
  { active, children, className, color, component, href, ...rest }: StepperItemProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = (component ?? 'li') as ElementType
  const _className = classNames('stepper-item', color && 'context', color, { active }, className)

  const mergedProps = {
    ...(href ? { href } : {}),
    ...(active ? { 'aria-current': 'step' } : {}),
    ...rest
  }

  return (
    <Component className={_className} {...mergedProps} ref={ref}>
      {children}
    </Component>
  )
}

export const StepperItem = createPolymorphicComponent<StepperItemComponent>(
  StepperItemRender as ForwardRefRenderFunction<Element, StepperItemProps<ElementType>>,
  'StepperItem'
)
