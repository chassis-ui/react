import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ModalBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type ModalBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ModalBodyOwnProps<C>
>

type ModalBodyComponent = (<C extends ElementType = 'div'>(
  props: ModalBodyProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ModalBodyRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: ModalBodyProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('modal-body', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ModalBody = createPolymorphicComponent<ModalBodyComponent>(
  ModalBodyRender as ForwardRefRenderFunction<Element, ModalBodyProps<ElementType>>,
  'ModalBody'
)
