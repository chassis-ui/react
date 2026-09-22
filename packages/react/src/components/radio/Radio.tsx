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
   *
   * Children are accepted as an alias for this prop — `label` wins when both are given.
   * react-aria, which backs this component, calls the same thing `children`; this package renames
   * it to `label`, and honouring both means the shape React developers reach for first still
   * names the control instead of silently producing an unlabelled one.
   */
  label?: ReactNode
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * The value of the radio button, used to identify it within its `<RadioGroup>`.
   */
  value: string
}

// `<Radio>` must be rendered inside a `<RadioGroup>` — react-aria has no standalone
// radio hook, only useRadio(props, RadioGroupState, ref), because a lone radio with no group is
// not a meaningful accessible control (see https://chassis-ui.com/css/docs/forms/checkbox-radio).
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ button, children, className, color, disabled, id, label, size, ...rest }, ref) => {
    const group = useContext(RadioGroupContext)

    if (!group) {
      throw new Error('Radio must be rendered inside a RadioGroup.')
    }

    const { state: groupState, valid } = group
    const invalid = groupState.isInvalid

    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    // `label` is this package's name for what react-aria calls `children`. Accept either, so the
    // shape React developers reach for first (`<Radio>Label</Radio>`) names the control instead of
    // being silently dropped — see the note on `label` in `RadioProps`.
    const resolvedLabel = label ?? children

    const { inputProps } = useRadio(
      {
        ...rest,
        children: resolvedLabel,
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
      label: resolvedLabel,
      size,
      valid
    })
  }
)

Radio.displayName = 'Radio'
