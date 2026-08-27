import React, { ElementType, ForwardRefRenderFunction, forwardRef, ReactElement } from 'react'
import classNames from 'classnames'

import { useModal } from '../../hooks'
import { PolymorphicComponentProps, PolymorphicRef } from '../../utils/polymorphic'

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
  const Component = component || 'h2'
  const _className = classNames('modal-title', className)

  return (
    <Component className={_className} id={id ?? titleId} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const ModalTitle = forwardRef(
  ModalTitleRender as ForwardRefRenderFunction<Element, ModalTitleProps<ElementType>>
) as ModalTitleComponent

ModalTitle.displayName = 'ModalTitle'
