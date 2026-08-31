import React, { ElementType, ForwardRefRenderFunction, ReactElement } from 'react'
import classNames from 'classnames'

import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type InputAdornOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component. Use
   * `"button"` or `"a"` for an actionable adorn, e.g. a password reveal toggle or a clear button.
   */
  component?: C
}

export type InputAdornProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  InputAdornOwnProps<C>
>

type InputAdornComponent = (<C extends ElementType = 'span'>(
  props: InputAdornProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function InputAdornRender<C extends ElementType = 'span'>(
  { children, className, component, onMouseDown, ...rest }: InputAdornProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'span'
  const _className = classNames('input-adorn', className)
  const handleMouseDown: React.MouseEventHandler<Element> = (event) => {
    onMouseDown?.(event)
    // Keep focus on the associated input (e.g. a password toggle) instead of
    // letting the browser shift it to this button/anchor on mousedown.
    if (!event.defaultPrevented) {
      event.preventDefault()
    }
  }
  return (
    <Component className={_className} onMouseDown={handleMouseDown} {...rest} ref={ref}>
      {children}
    </Component>
  )
}

export const InputAdorn = createPolymorphicComponent<InputAdornComponent>(
  InputAdornRender as ForwardRefRenderFunction<Element, InputAdornProps<ElementType>>,
  'InputAdorn'
)
