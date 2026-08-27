import React, { forwardRef, InputHTMLAttributes, ReactNode, useContext, useRef } from 'react'
import classNames from 'classnames'
import { AriaRadioProps, useRadio } from 'react-aria'

import { useForkedRef } from '../../hooks'
import { ContextColor } from '../../types'
import { validationClassName } from '../../utils/validationClassName'

import { RadioGroupContext } from './context'
import { ButtonObject, renderFormCheck } from '../form/renderFormCheck'

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'onChange' | 'size'
> {
  /**
   * Create button-like radios. Combine with `<RadioGroup>` to build radio toggle-button groups.
   */
  button?: ButtonObject
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the radio indicator to one of Chassis context colors. Ignored when `button` is set.
   */
  color?: ContextColor
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * The element represents a caption for a component.
   */
  label?: ReactNode
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * The value of the radio button, used to identify it within its `<RadioGroup>`.
   */
  value: string
}

// `<Radio>` must be rendered inside a `<RadioGroup>` — react-aria has no standalone
// radio hook, only useRadio(props, RadioGroupState, ref), because a lone radio with no group is
// not a meaningful accessible control (see https://chassis-ui.com/css/docs/forms/checkbox-radio).
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ button, className, color, disabled, id, label, size, ...rest }, ref) => {
    const group = useContext(RadioGroupContext)

    if (!group) {
      throw new Error('Radio must be rendered inside a RadioGroup.')
    }

    const { state: groupState, valid } = group
    const invalid = groupState.isInvalid

    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    const { inputProps } = useRadio(
      {
        ...rest,
        children: label,
        isDisabled: disabled
      } as AriaRadioProps,
      groupState,
      inputRef
    )

    const inputClassName = classNames(validationClassName(invalid, valid))

    return renderFormCheck({
      button,
      className,
      color,
      input: <input {...inputProps} className={inputClassName} id={id} ref={forkedRef} />,
      invalid,
      label,
      size,
      valid
    })
  }
)

Radio.displayName = 'Radio'
