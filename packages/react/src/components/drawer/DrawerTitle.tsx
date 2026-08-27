import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import { useDrawer } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type DrawerTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
}

export type DrawerTitleProps<C extends ElementType = 'h2'> = PolymorphicComponentProps<
  C,
  DrawerTitleOwnProps<C>
>

type DrawerTitleComponent = (<C extends ElementType = 'h2'>(
  props: DrawerTitleProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function DrawerTitleRender<C extends ElementType = 'h2'>(
  { children, component, className, id, ...rest }: DrawerTitleProps<C>,
  ref: PolymorphicRef<C>
) {
  const { titleId } = useDrawer()
  const Component = component ?? 'h2'
  const _className = classNames('drawer-title', className)

  return (
    <Component className={_className} id={id ?? titleId} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const DrawerTitle = createPolymorphicComponent<DrawerTitleComponent>(
  DrawerTitleRender as ForwardRefRenderFunction<Element, DrawerTitleProps<ElementType>>,
  'DrawerTitle'
)
