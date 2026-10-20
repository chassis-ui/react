import React, { ElementType, ForwardRefRenderFunction, ReactElement, useContext } from 'react'
import classNames from 'classnames'

import { useIsomorphicLayoutEffect } from '../../hooks'
import { DrawerTitleContext } from './context'
import { useDrawer } from './useDrawer'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { resolveSlottedId } from '../../utils/elementKind'

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
  const registerTitle = useContext(DrawerTitleContext)
  const Component = component ?? 'h2'
  const _className = classNames('drawer-title', className)
  // Under `asChild` the child's own `id` is the one rendered (`Slot`), so it is the one registered.
  const resolvedId = resolveSlottedId(Component) ?? id ?? titleId

  // The drawer is labelled by this title, under the id it has here.
  useIsomorphicLayoutEffect(
    () => (resolvedId ? registerTitle(resolvedId) : undefined),
    [registerTitle, resolvedId]
  )

  return (
    <Component className={_className} id={resolvedId} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const DrawerTitle = createPolymorphicComponent<DrawerTitleComponent>(
  DrawerTitleRender as ForwardRefRenderFunction<Element, DrawerTitleProps<ElementType>>,
  'DrawerTitle'
)
