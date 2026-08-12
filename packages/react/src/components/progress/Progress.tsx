import React, { CSSProperties, forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'
import { ProgressBar } from './ProgressBar'
import { ContextColor } from '../../types'

type ProgressStyle = CSSProperties & {
  '--cx-height'?: string
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
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

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      'aria-label': ariaLabel,
      animated,
      children,
      className,
      color,
      height,
      inlineValue,
      label,
      showValue,
      striped,
      style,
      value = 0,
      ...rest
    },
    ref
  ) => {
    const _className = classNames('progress', className)

    const barChildren = children !== undefined ? children : inlineValue ? `${value}%` : undefined
    const hasCaption = Boolean(label || showValue)

    const _style: ProgressStyle = { ...style }
    if (height !== undefined) _style['--cx-height'] = `${height}px`

    const progressElement = (
      <div
        {...rest}
        className={_className}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
        style={_style}
        ref={ref}
      >
        <ProgressBar animated={animated} color={color} striped={striped} value={value}>
          {barChildren}
        </ProgressBar>
      </div>
    )

    if (!hasCaption) return progressElement

    return (
      <div className="d-flex flex-column gap-xsmall">
        <div
          className={classNames(
            'd-flex',
            label ? 'justify-content-between' : 'justify-content-end'
          )}
        >
          {label ? <span className="font-strong">{label}</span> : null}
          {showValue ? <span className="font-strong">{value}%</span> : null}
        </div>
        {progressElement}
      </div>
    )
  }
)

Progress.displayName = 'Progress'
