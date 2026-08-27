import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type AccordionBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type AccordionBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  AccordionBodyOwnProps<C>
>

type AccordionBodyComponent = (<C extends ElementType = 'div'>(
  props: AccordionBodyProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function AccordionBodyRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: AccordionBodyProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'

  return (
    <Component className={classNames('accordion-body', className)} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const AccordionBody = createPolymorphicComponent<AccordionBodyComponent>(
  AccordionBodyRender as ForwardRefRenderFunction<Element, AccordionBodyProps<ElementType>>,
  'AccordionBody'
)
