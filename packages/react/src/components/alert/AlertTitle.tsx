import React, { ElementType, ForwardRefRenderFunction, ReactElement, useId } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks/useForkedRef'
import { useAlertPart } from './useAlertPart'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type AlertTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'h2'
   */
  component?: C
}

export type AlertTitleProps<C extends ElementType = 'h2'> = PolymorphicComponentProps<
  C,
  AlertTitleOwnProps<C>
>

type AlertTitleComponent = (<C extends ElementType = 'h2'>(
  props: AlertTitleProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

// `.alert-title`: its id, whichever reaches the DOM, joins the alert's `aria-labelledby`.

function AlertTitleRender<C extends ElementType = 'h2'>(
  { children, className, component, id, ...rest }: AlertTitleProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'h2'
  const generatedId = useId()
  const nodeRef = useAlertPart('title')
  const forkedRef = useForkedRef(ref, nodeRef)

  return (
    <Component
      className={classNames('alert-title', className)}
      id={id ?? generatedId}
      {...rest}
      ref={forkedRef}
    >
      {children}
    </Component>
  )
}

export const AlertTitle = createPolymorphicComponent<AlertTitleComponent>(
  AlertTitleRender as ForwardRefRenderFunction<Element, AlertTitleProps<ElementType>>,
  'AlertTitle'
)
