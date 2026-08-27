import React, {
  Children,
  ElementType,
  ForwardRefRenderFunction,
  isValidElement,
  ReactElement
} from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { StepperItem } from './StepperItem'

export interface StepperItemDef {
  /**
   * Step label content.
   */
  label: React.ReactNode
  /**
   * Marks the item as the current step.
   */
  active?: boolean
  /**
   * Sets the color of the item.
   */
  color?: ContextColor
  /**
   * Renders the item as a link to the given URL.
   */
  href?: string
}

type StepperOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `'ol'`, unless a step (a data-driven item with `href`, or a `<StepperItem
   * component="a">`/`<StepperItem component="button">` child) is interactive — a bare `<a>`/
   * `<button>` isn't a valid direct child of `<ol>`, so the default switches to `'div'` instead.
   * Pass `component` explicitly to opt out of this.
   */
  component?: C
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Replaces the step counters with icons, driven by the `--status-icon` custom property.
   */
  icon?: boolean
  /**
   * Array of step definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: StepperItemDef[]
  /**
   * Lays out steps side-by-side instead of stacking them vertically, either unconditionally or
   * from a given breakpoint up.
   */
  layout?:
    | 'horizontal'
    | 'small:horizontal'
    | 'medium:horizontal'
    | 'large:horizontal'
    | 'xlarge:horizontal'
    | '2xlarge:horizontal'
  /**
   * Wraps the stepper in a horizontally scrollable container so steps keep their natural width
   * instead of shrinking to fit.
   */
  overflow?: boolean
}

export type StepperProps<C extends ElementType = 'ol'> = PolymorphicComponentProps<
  C,
  StepperOwnProps<C>
>

type StepperComponent = (<C extends ElementType = 'ol'>(
  props: StepperProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function StepperRender<C extends ElementType = 'ol'>(
  {
    children,
    className,
    component,
    color,
    icon,
    items,
    layout,
    overflow,
    ...rest
  }: StepperProps<C>,
  ref: PolymorphicRef<C>
) {
  // A linked step (data-driven `href`, or a `<StepperItem component="a"|"button">` child) can't
  // render as a bare `<a>`/`<button>` inside the default `<ol>` root — only `<li>`/`script`/
  // `template` are valid children there. Default to `<div>` instead when that's the case
  // (unless the caller already chose their own `component`) — matching the
  // `<Stepper component="div">` pattern already documented for composed interactive usage.
  const hasInteractiveItem = items
    ? items.some((item) => !!item.href)
    : Children.toArray(children).some(
        (child) =>
          isValidElement<{ component?: ElementType }>(child) &&
          child.type === StepperItem &&
          (child.props.component === 'a' || child.props.component === 'button')
      )
  const Component = (component ?? (hasInteractiveItem ? 'div' : 'ol')) as ElementType
  const isListSemantic = Component === 'ol' || Component === 'ul'

  const _className = classNames(
    'stepper',
    color && 'context',
    color,
    layout,
    { 'icon-stepper': icon },
    className
  )

  const autoContent = items
    ? items.map((item, idx) => (
        <StepperItem
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          active={item.active}
          color={item.color}
          component={item.href ? 'a' : isListSemantic ? 'li' : 'div'}
          href={item.href}
        >
          {item.label}
        </StepperItem>
      ))
    : null

  // When the root switched to `div` because of an interactive step, every plain `<StepperItem>`
  // sibling defaulting to `<li>` would be just as invalid (only valid inside `<ul>`/`<ol>`/
  // `<menu>`) — so give each `StepperItem` child the same `div` treatment the auto-generated
  // steps above already get, unless it set its own `component`. Other child types are left
  // untouched — this is only meaningful for `Stepper`'s own steps.
  const renderedChildren =
    autoContent ??
    (isListSemantic
      ? children
      : Children.map(children, (child) =>
          isValidElement<{ component?: ElementType }>(child) && child.type === StepperItem
            ? React.cloneElement(child, { component: child.props.component ?? 'div' })
            : child
        ))

  const stepperEl = (
    <Component className={_className} {...rest} ref={ref}>
      {renderedChildren}
    </Component>
  )

  if (!overflow) return stepperEl

  return <div className="stepper-overflow">{stepperEl}</div>
}

export const Stepper = createPolymorphicComponent<StepperComponent>(
  StepperRender as ForwardRefRenderFunction<Element, StepperProps<ElementType>>,
  'Stepper'
)
