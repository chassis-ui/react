import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ModalFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Stack the footer actions as full-width columns instead of a right-aligned row.
   */
  stacked?: boolean
}

export type ModalFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ModalFooterOwnProps<C>
>

type ModalFooterComponent = (<C extends ElementType = 'div'>(
  props: ModalFooterProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ModalFooterRender<C extends ElementType = 'div'>(
  { children, className, component, stacked, ...rest }: ModalFooterProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('modal-footer', { stacked }, className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ModalFooter = createPolymorphicComponent<ModalFooterComponent>(
  ModalFooterRender as ForwardRefRenderFunction<Element, ModalFooterProps<ElementType>>,
  'ModalFooter'
)
