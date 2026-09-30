import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type AlertFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   *
   * @default 'div'
   */
  component?: C
  /**
   * Stacks the actions as full-width rows on small screens, instead of sharing one row.
   */
  stacked?: boolean
}

export type AlertFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  AlertFooterOwnProps<C>
>

type AlertFooterComponent = (<C extends ElementType = 'div'>(
  props: AlertFooterProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

// `.alert-footer`: the actions. chassis-css lays them out right to left, so write the primary
// action first. Give a separate destructive action `className="me-auto"` to push it to the other
// end.

function AlertFooterRender<C extends ElementType = 'div'>(
  { children, className, component, stacked, ...rest }: AlertFooterProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'

  return (
    <Component className={classNames('alert-footer', { stacked }, className)} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const AlertFooter = createPolymorphicComponent<AlertFooterComponent>(
  AlertFooterRender as ForwardRefRenderFunction<Element, AlertFooterProps<ElementType>>,
  'AlertFooter'
)
