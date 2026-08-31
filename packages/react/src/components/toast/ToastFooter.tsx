import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ToastFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type ToastFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ToastFooterOwnProps<C>
>

type ToastFooterComponent = (<C extends ElementType = 'div'>(
  props: ToastFooterProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ToastFooterRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: ToastFooterProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('toast-footer', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ToastFooter = createPolymorphicComponent<ToastFooterComponent>(
  ToastFooterRender as ForwardRefRenderFunction<Element, ToastFooterProps<ElementType>>,
  'ToastFooter'
)
