import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'

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

export interface StepperProps extends HTMLAttributes<HTMLOListElement | HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
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

export const Stepper = forwardRef<HTMLOListElement | HTMLDivElement, StepperProps>(
  (
    {
      children,
      className,
      component: Component = 'ol',
      color,
      icon,
      items,
      layout,
      overflow,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      'stepper',
      color && 'context',
      color,
      layout,
      { 'icon-stepper': icon },
      className
    )

    const autoContent = items
      ? items.map((item, idx) => {
          const itemClass = classNames('stepper-item', item.color && 'context', item.color, {
            active: item.active
          })
          const Tag = item.href ? 'a' : 'li'
          return (
            <Tag
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={itemClass}
              {...(item.href ? { href: item.href } : {})}
              {...(item.active ? { 'aria-current': 'step' } : {})}
            >
              {item.label}
            </Tag>
          )
        })
      : null

    const stepperEl = (
      <Component className={_className} {...rest} ref={ref}>
        {autoContent ?? children}
      </Component>
    )

    if (!overflow) return stepperEl

    return <div className="stepper-overflow">{stepperEl}</div>
  }
)

Stepper.displayName = 'Stepper'
