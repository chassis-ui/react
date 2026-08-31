import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { Link } from '../link/Link'

type ListItemOwnProps<C extends ElementType> = {
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
  component?: C
  /**
   * The href attribute specifies the URL of the page the link goes to. Only applicable when
   * `component` is `"a"`.
   */
  href?: string
}

export type ListItemProps<C extends ElementType = 'li'> = PolymorphicComponentProps<
  C,
  ListItemOwnProps<C>
>

type ListItemComponent = (<C extends ElementType = 'li'>(
  props: ListItemProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ListItemRender<C extends ElementType = 'li'>(
  { children, active, className, disabled, color, component, ...rest }: ListItemProps<C>,
  ref: PolymorphicRef<C>
) {
  const tag = component ?? 'li'
  const isInteractive = tag === 'a' || tag === 'button'

  const _className = classNames(
    'list-item',
    color && 'context',
    color,
    {
      'list-action': isInteractive,
      active,
      disabled
    },
    className
  )

  const Component = (isInteractive ? Link : tag) as ElementType

  const finalRest = {
    ...(isInteractive && {
      active,
      disabled,
      component: tag
    }),
    ...(active && { 'aria-current': 'page' }),
    ...(disabled && { 'aria-disabled': true }),
    ...rest
  }

  return (
    <Component className={_className} {...finalRest} ref={ref}>
      {children}
    </Component>
  )
}

export const ListItem = createPolymorphicComponent<ListItemComponent>(
  ListItemRender as ForwardRefRenderFunction<Element, ListItemProps<ElementType>>,
  'ListItem'
)
