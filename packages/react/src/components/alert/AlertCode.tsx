import React, { ElementType, ForwardRefRenderFunction, ReactElement, useId } from 'react'
import classNames from 'classnames'

import { useForkedRef } from '../../hooks/useForkedRef'
import { useAlertPart } from './useAlertPart'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type AlertCodeOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'code'
   */
  component?: C
}

export type AlertCodeProps<C extends ElementType = 'code'> = PolymorphicComponentProps<
  C,
  AlertCodeOwnProps<C>
>

type AlertCodeComponent = (<C extends ElementType = 'code'>(
  props: AlertCodeProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

// `.alert-code`: a machine-readable reference, such as an error code, shown under the title. Its
// id joins the alert's `aria-describedby`, in document order with the text's.

function AlertCodeRender<C extends ElementType = 'code'>(
  { children, className, component, id, ...rest }: AlertCodeProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'code'
  const generatedId = useId()
  const nodeRef = useAlertPart('description')
  const forkedRef = useForkedRef(ref, nodeRef)

  return (
    <Component
      className={classNames('alert-code', className)}
      id={id ?? generatedId}
      {...rest}
      ref={forkedRef}
    >
      {children}
    </Component>
  )
}

export const AlertCode = createPolymorphicComponent<AlertCodeComponent>(
  AlertCodeRender as ForwardRefRenderFunction<Element, AlertCodeProps<ElementType>>,
  'AlertCode'
)
