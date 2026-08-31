import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { useModal } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { CloseButton } from '../close-button/CloseButton'

type ModalHeaderOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type ModalHeaderProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ModalHeaderOwnProps<C>
>

type ModalHeaderComponent = (<C extends ElementType = 'div'>(
  props: ModalHeaderProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ModalHeaderRender<C extends ElementType = 'div'>(
  { children, className, closeButton = true, closeLabel, component, ...rest }: ModalHeaderProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const { close } = useModal()
  const _className = classNames('modal-header', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
      {closeButton && <CloseButton label={closeLabel} onClick={close} />}
    </Component>
  )
}

export const ModalHeader = createPolymorphicComponent<ModalHeaderComponent>(
  ModalHeaderRender as ForwardRefRenderFunction<Element, ModalHeaderProps<ElementType>>,
  'ModalHeader'
)
