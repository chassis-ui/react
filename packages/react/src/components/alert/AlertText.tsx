import React, { ElementType, ForwardRefRenderFunction, ReactElement, useId } from 'react'

import { useForkedRef } from '../../hooks/useForkedRef'
import { useAlertPart } from './useAlertPart'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type AlertTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'p'
   */
  component?: C
}

export type AlertTextProps<C extends ElementType = 'p'> = PolymorphicComponentProps<
  C,
  AlertTextOwnProps<C>
>

type AlertTextComponent = (<C extends ElementType = 'p'>(
  props: AlertTextProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

// The alert's message. Its id joins the alert's `aria-describedby`. chassis-css styles it as a
// `<p>` inside `.alert-body`, with no class of its own.

function AlertTextRender<C extends ElementType = 'p'>(
  { children, className, component, id, ...rest }: AlertTextProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'p'
  const generatedId = useId()
  const nodeRef = useAlertPart('description')
  const forkedRef = useForkedRef(ref, nodeRef)

  return (
    <Component className={className} id={id ?? generatedId} {...rest} ref={forkedRef}>
      {children}
    </Component>
  )
}

export const AlertText = createPolymorphicComponent<AlertTextComponent>(
  AlertTextRender as ForwardRefRenderFunction<Element, AlertTextProps<ElementType>>,
  'AlertText'
)
