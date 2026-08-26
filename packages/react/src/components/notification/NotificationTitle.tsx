import React, { ElementType, ForwardRefRenderFunction, forwardRef, ReactElement } from 'react'
import classNames from 'classnames'

import { PolymorphicComponentProps, PolymorphicRef } from '../../utils/polymorphic'

type NotificationTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type NotificationTitleProps<C extends ElementType = 'h4'> = PolymorphicComponentProps<
  C,
  NotificationTitleOwnProps<C>
>

type NotificationTitleComponent = (<C extends ElementType = 'h4'>(
  props: NotificationTitleProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function NotificationTitleRender<C extends ElementType = 'h4'>(
  { children, className, component, ...rest }: NotificationTitleProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component || 'h4'
  const _className = classNames('notification-title', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const NotificationTitle = forwardRef(
  NotificationTitleRender as ForwardRefRenderFunction<Element, NotificationTitleProps<ElementType>>
) as NotificationTitleComponent

NotificationTitle.displayName = 'NotificationTitle'
