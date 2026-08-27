import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type FormFeedbackOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * If your form layout allows it, you can display validation feedback in a styled tooltip.
   */
  tooltip?: boolean
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
}

export type FormFeedbackProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  FormFeedbackOwnProps<C>
>

type FormFeedbackComponent = (<C extends ElementType = 'div'>(
  props: FormFeedbackProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function FormFeedbackRender<C extends ElementType = 'div'>(
  { children, className, component, invalid, tooltip, valid, ...rest }: FormFeedbackProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames(
    {
      [`invalid-${tooltip ? 'tooltip' : 'feedback'}`]: invalid,
      [`valid-${tooltip ? 'tooltip' : 'feedback'}`]: valid
    },
    className
  )
  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const FormFeedback = createPolymorphicComponent<FormFeedbackComponent>(
  FormFeedbackRender as ForwardRefRenderFunction<Element, FormFeedbackProps<ElementType>>,
  'FormFeedback'
)
