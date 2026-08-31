import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type FormHelpOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type FormHelpProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  FormHelpOwnProps<C>
>

type FormHelpComponent = (<C extends ElementType = 'div'>(
  props: FormHelpProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function FormHelpRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: FormHelpProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('form-help', className)
  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const FormHelp = createPolymorphicComponent<FormHelpComponent>(
  FormHelpRender as ForwardRefRenderFunction<Element, FormHelpProps<ElementType>>,
  'FormHelp'
)
