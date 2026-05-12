import React, { ChangeEventHandler, forwardRef, InputHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CFormRangeProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Specifies the maximum value for the component.
   */
  max?: number
  /**
   * Specifies the minimum value for the component.
   */
  min?: number
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Specifies the interval between legal numbers in the component.
   */
  steps: number
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: string | string[] | number
}

export const CxFormRange = forwardRef<HTMLInputElement, CFormRangeProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('form-range', className)
    return <input type="range" className={_className} {...rest} ref={ref} />
  },
)

CxFormRange.displayName = 'CxFormRange'
