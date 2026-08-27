import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { CloseButton } from '../close-button/CloseButton'
import { useToast } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ToastBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Adds a close button alongside the body content, so a toast composed without a
   * `ToastHeader` still gets a dismiss control without any manual layout markup.
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

export type ToastBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ToastBodyOwnProps<C>
>

type ToastBodyComponent = (<C extends ElementType = 'div'>(
  props: ToastBodyProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ToastBodyRender<C extends ElementType = 'div'>(
  { children, className, closeButton, closeLabel, component, ...rest }: ToastBodyProps<C>,
  ref: PolymorphicRef<C>
) {
  const { close } = useToast()
  const Component = component ?? 'div'
  const _className = classNames(
    'toast-body',
    { 'd-flex align-items-start justify-content-between gap-small': closeButton },
    className
  )
  return (
    <Component className={_className} {...rest} ref={ref}>
      {closeButton ? <div>{children}</div> : children}
      {closeButton && <CloseButton label={closeLabel} onClick={close} />}
    </Component>
  )
}

export const ToastBody = createPolymorphicComponent<ToastBodyComponent>(
  ToastBodyRender as ForwardRefRenderFunction<Element, ToastBodyProps<ElementType>>,
  'ToastBody'
)
