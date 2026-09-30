import React, {
  Children,
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  ReactNode,
  useId
} from 'react'
import classNames from 'classnames'
import { useSeparator } from 'react-aria'

import './Divider.scss'
import { devWarning } from '../../utils/devWarning'
import { resolveElementTag } from '../../utils/elementKind'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef,
  PolymorphicRefWithFallback
} from '../../utils/polymorphic'

type DividerOwnProps<C extends ElementType> = {
  /**
   * A label shown in the line, such as "or" between two ways to sign in. It names the separator
   * for screen readers. Not possible on an `<hr>`, which can't hold content.
   */
  children?: ReactNode
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use an HTML element or a component.
   * Defaults to `hr`, or `div` for a vertical divider or one with a label.
   */
  component?: C
  /**
   * Where the label sits along the line. `start` and `end` draw the line on one side only.
   *
   * @default 'center'
   */
  labelPlacement?: 'start' | 'center' | 'end'
  /**
   * The direction of the line. A vertical divider stretches to the height of its flex row.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

export type DividerProps<C extends ElementType = 'hr'> = PolymorphicComponentProps<
  C,
  DividerOwnProps<C>
>

type DividerComponent = (<C extends ElementType = 'hr'>(
  // A vertical or labelled divider renders a `<div>` while `C` stays `'hr'`.
  props: DividerProps<C> & { ref?: PolymorphicRefWithFallback<C, HTMLDivElement> }
) => ReactElement | null) & { displayName?: string }

function DividerRender<C extends ElementType = 'hr'>(
  {
    children,
    className,
    component,
    labelPlacement = 'center',
    orientation = 'horizontal',
    ...rest
  }: DividerProps<C>,
  ref: PolymorphicRef<C>
) {
  // What renders nothing (`null`, a boolean, `''`, an empty array) is no label.
  const hasLabel = Children.toArray(children).some((child) => child !== '')
  const Component = component ?? (orientation === 'vertical' || hasLabel ? 'div' : 'hr')
  const rootTag = resolveElementTag(Component)
  const labelId = useId()

  // An `<hr>` is a void element: React throws on its children.
  devWarning(
    rootTag === 'hr' && hasLabel,
    'Divider: an `<hr>` cannot hold a label, so the label is not rendered. Leave `component` ' +
      'unset, or render another element.'
  )
  const label = hasLabel && rootTag !== 'hr'
  const labelling = rest as { 'aria-label'?: string; 'aria-labelledby'?: string }
  const named = labelling['aria-label'] != null || labelling['aria-labelledby'] != null

  const { separatorProps } = useSeparator({ elementType: rootTag, orientation })
  // react-aria leaves an `<hr>`'s orientation to its implicit role, which is horizontal.
  if (rootTag === 'hr' && orientation === 'vertical')
    separatorProps['aria-orientation'] = 'vertical'

  return (
    <Component
      className={classNames(
        'divider',
        orientation === 'vertical' && 'divider-vertical',
        label && 'divider-labelled',
        label && labelPlacement !== 'center' && `divider-${labelPlacement}`,
        className
      )}
      {...separatorProps}
      aria-labelledby={label && !named ? labelId : undefined}
      {...rest}
      ref={ref}
    >
      {label ? (
        <span className="divider-label" id={labelId}>
          {children}
        </span>
      ) : undefined}
    </Component>
  )
}

export const Divider = createPolymorphicComponent<DividerComponent>(
  DividerRender as ForwardRefRenderFunction<Element, DividerProps<ElementType>>,
  'Divider'
)
