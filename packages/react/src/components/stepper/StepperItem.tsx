import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import { hrefProps, linkElement, resolveElementKind } from '../../utils/elementKind'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef,
  PolymorphicRefWithFallback
} from '../../utils/polymorphic'

type StepperItemOwnProps<C extends ElementType> = {
  /**
   * Marks the item as the current step.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * The `href` attribute for an interactive step rendered as a link. Renders an `<a>` in place of
   * the `<li>`, unless `component` or `asChild` chose the element. Inside a `Stepper`, the stepper
   * renders a `<div>` around it in place of the `<ol>`.
   */
  href?: string
}

export type StepperItemProps<C extends ElementType = 'li'> = PolymorphicComponentProps<
  C,
  StepperItemOwnProps<C>
>

type StepperItemComponent = (<C extends ElementType = 'li'>(
  props: StepperItemProps<C> & {
    ref?: PolymorphicRefWithFallback<C, HTMLLIElement | HTMLAnchorElement>
  }
) => ReactElement | null) & { displayName?: string }

function StepperItemRender<C extends ElementType = 'li'>(
  { active, children, className, color, component, href, ...rest }: StepperItemProps<C>,
  ref: PolymorphicRef<C>
) {
  // `href` makes it an `<a>`, unless `component` or `asChild` chose the element (see
  // `linkElement`). It used to stay an `<li>` and carry `href` as an attribute.
  const Component = linkElement(component, href, 'li')
  const _className = classNames('stepper-item', color && 'context', color, { active }, className)

  const mergedProps = {
    ...hrefProps(resolveElementKind(Component), href, 'StepperItem'),
    ...(active ? { 'aria-current': 'step' } : {}),
    ...rest
  }

  return (
    <Component className={_className} {...mergedProps} ref={ref}>
      {children}
    </Component>
  )
}

export const StepperItem = createPolymorphicComponent<StepperItemComponent>(
  StepperItemRender as ForwardRefRenderFunction<Element, StepperItemProps<ElementType>>,
  'StepperItem'
)
