import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'

export interface StepperItemProps extends HTMLAttributes<
  HTMLLIElement | HTMLAnchorElement | HTMLButtonElement
> {
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
  component?: string | ElementType
  /**
   * The `href` attribute for an interactive step rendered as a link.
   */
  href?: string
}

export const StepperItem = forwardRef<
  HTMLLIElement | HTMLAnchorElement | HTMLButtonElement,
  StepperItemProps
>(({ children, active, className, color, component: Component = 'li', href, ...rest }, ref) => {
  const _className = classNames('stepper-item', color && 'context', color, { active }, className)

  rest = {
    ...(href ? { href } : {}),
    ...(active ? { 'aria-current': 'step' } : {}),
    ...rest
  }

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
})

StepperItem.displayName = 'StepperItem'
