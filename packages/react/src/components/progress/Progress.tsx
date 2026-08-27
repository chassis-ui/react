import React, {
  CSSProperties,
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  ReactNode,
  useId
} from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { ProgressBar } from './ProgressBar'

type ProgressStyle = CSSProperties & {
  '--cx-height'?: string
}

type ProgressOwnProps<C extends ElementType> = {
  /**
   * Use to animate the stripes right to left via CSS3 animations.
   */
  animated?: boolean
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
   * Sets the height of the component, via the `--cx-height` custom property. If you set that
   * value the inner bar (and the striped pattern's tile size) automatically resizes accordingly.
   */
  height?: number
  /**
   * Shows the current value as text inside the bar, independently of `showValue` — combine both
   * to get a `label` + `showValue` caption above the bar alongside an `inlineValue` reading
   * inside it.
   */
  inlineValue?: boolean
  /**
   * A text label describing the progress. Rendered in a caption row above the bar. Also used as
   * the default accessible name when no `aria-label`/`aria-labelledby` is supplied.
   */
  label?: ReactNode
  /**
   * Shows the current value as text in the caption row above the bar, alongside `label` when
   * both are set, or alone otherwise. Use `inlineValue` to show it inside the bar instead.
   */
  showValue?: boolean
  /**
   * Adds a diagonal stripe pattern over the bar's background.
   */
  striped?: boolean
  /**
   * The percent to progress the ProgressBar (out of 100).
   */
  value?: number
}

export type ProgressProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ProgressOwnProps<C>
>

type ProgressComponent = (<C extends ElementType = 'div'>(
  props: ProgressProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ProgressRender<C extends ElementType = 'div'>(
  {
    'aria-label': ariaLabel,
    animated,
    children,
    className,
    color,
    component,
    height,
    inlineValue,
    label,
    showValue,
    striped,
    style,
    value = 0,
    ...rest
  }: ProgressProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = component ?? 'div'
  const _className = classNames('progress', className)
  const clampedValue = Math.min(100, Math.max(0, value))

  const barChildren =
    children !== undefined ? children : inlineValue ? `${clampedValue}%` : undefined
  const hasCaption = Boolean(label || showValue)

  const labelId = useId()
  const isNodeLabel = label != null && typeof label !== 'string'

  const _style: ProgressStyle = { ...style }
  if (height !== undefined) _style['--cx-height'] = `${height}px`

  const progressElement = (
    <Component
      {...rest}
      className={_className}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      aria-labelledby={!ariaLabel && isNodeLabel ? labelId : undefined}
      style={_style}
      ref={ref}
    >
      <ProgressBar animated={animated} color={color} striped={striped} value={clampedValue}>
        {barChildren}
      </ProgressBar>
    </Component>
  )

  if (!hasCaption) return progressElement

  return (
    <div className="d-flex flex-column gap-xsmall">
      <div
        className={classNames('d-flex', label ? 'justify-content-between' : 'justify-content-end')}
      >
        {label ? (
          <span className="font-strong" id={isNodeLabel ? labelId : undefined}>
            {label}
          </span>
        ) : null}
        {showValue ? <span className="font-strong">{clampedValue}%</span> : null}
      </div>
      {progressElement}
    </div>
  )
}

export const Progress = createPolymorphicComponent<ProgressComponent>(
  ProgressRender as ForwardRefRenderFunction<Element, ProgressProps<ElementType>>,
  'Progress'
)
