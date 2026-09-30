import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type AlertBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'div'
   */
  component?: C
}

export type AlertBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  AlertBodyOwnProps<C>
>

type AlertBodyComponent = (<C extends ElementType = 'div'>(
  props: AlertBodyProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

// `.alert-body`: the column that holds the title, an optional code and the message.

function AlertBodyRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: AlertBodyProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'

  return (
    <Component className={classNames('alert-body', className)} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const AlertBody = createPolymorphicComponent<AlertBodyComponent>(
  AlertBodyRender as ForwardRefRenderFunction<Element, AlertBodyProps<ElementType>>,
  'AlertBody'
)
