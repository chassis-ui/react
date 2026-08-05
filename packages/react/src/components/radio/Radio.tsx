import React, { forwardRef, InputHTMLAttributes, ReactNode, useContext, useRef } from 'react'
import { AriaRadioProps, useRadio } from 'react-aria'

import { useForkedRef } from '../../hooks'
import { ContextColor } from '../Types'

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
  label?: string | ReactNode
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
    const groupState = useContext(RadioGroupContext)

    if (!groupState) {
      throw new Error('Radio must be rendered inside a RadioGroup.')
    }

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

    return renderFormCheck({
      button,
      className,
      color,
      input: <input {...inputProps} id={id} ref={forkedRef} />,
      label,
      size
    })
  }
)

Radio.displayName = 'Radio'
