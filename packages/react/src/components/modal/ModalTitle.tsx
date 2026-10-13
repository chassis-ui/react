import React, { ElementType, ForwardRefRenderFunction, ReactElement, useContext } from 'react'
import classNames from 'classnames'

import { useIsomorphicLayoutEffect } from '../../hooks'
import { ModalTitleContext } from './Modal'
import { useModal } from './useModal'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ModalTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type ModalTitleProps<C extends ElementType = 'h2'> = PolymorphicComponentProps<
  C,
  ModalTitleOwnProps<C>
>

type ModalTitleComponent = (<C extends ElementType = 'h2'>(
  props: ModalTitleProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ModalTitleRender<C extends ElementType = 'h2'>(
  { children, component, className, id, ...rest }: ModalTitleProps<C>,
  ref: PolymorphicRef<C>
) {
  const { titleId } = useModal()
  const registerTitle = useContext(ModalTitleContext)
  const Component = component ?? 'h2'
  const _className = classNames('modal-title', className)
  const resolvedId = id ?? titleId

  // The modal is labelled by this title, under the id it has here.
  useIsomorphicLayoutEffect(
    () => (resolvedId ? registerTitle(resolvedId) : undefined),
    [registerTitle, resolvedId]
  )

  return (
    <Component className={_className} id={resolvedId} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ModalTitle = createPolymorphicComponent<ModalTitleComponent>(
  ModalTitleRender as ForwardRefRenderFunction<Element, ModalTitleProps<ElementType>>,
  'ModalTitle'
)
