import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type NotificationTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type NotificationTextProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  NotificationTextOwnProps<C>
>

type NotificationTextComponent = (<C extends ElementType = 'div'>(
  props: NotificationTextProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NotificationTextRender<C extends ElementType = 'div'>(
  { children, component, className, ...rest }: NotificationTextProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('notification-text', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const NotificationText = createPolymorphicComponent<NotificationTextComponent>(
  NotificationTextRender as ForwardRefRenderFunction<Element, NotificationTextProps<ElementType>>,
  'NotificationText'
)
