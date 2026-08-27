import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type DrawerBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type DrawerBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  DrawerBodyOwnProps<C>
>

type DrawerBodyComponent = (<C extends ElementType = 'div'>(
  props: DrawerBodyProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function DrawerBodyRender<C extends ElementType = 'div'>(
  { children, className, component, ...rest }: DrawerBodyProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('drawer-body', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const DrawerBody = createPolymorphicComponent<DrawerBodyComponent>(
  DrawerBodyRender as ForwardRefRenderFunction<Element, DrawerBodyProps<ElementType>>,
  'DrawerBody'
)
