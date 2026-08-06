import React, { ElementType, HTMLAttributes, forwardRef } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import { Link } from '../link/Link'

export interface ListItemProps extends HTMLAttributes<
  HTMLLIElement | HTMLAnchorElement | HTMLButtonElement
> {
  /**
   * Toggle the active state for the component.
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
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const ListItem = forwardRef<
  HTMLLIElement | HTMLAnchorElement | HTMLButtonElement,
  ListItemProps
>(({ children, active, className, disabled, color, component = 'li', ...rest }, ref) => {
  const _className = classNames(
    'list-item',
    color && 'context',
    color,
    {
      'list-action': component === 'a' || component === 'button',
      active,
      disabled
    },
    className
  )

  const Component = (component === 'a' || component === 'button' ? Link : component) as ElementType

  rest = {
    ...((component === 'a' || component === 'button') && {
      active,
      disabled,
      component
    }),
    ...(active && { 'aria-current': true }),
    ...(disabled && { 'aria-disabled': true }),
    ...rest
  }

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
})

ListItem.displayName = 'ListItem'
