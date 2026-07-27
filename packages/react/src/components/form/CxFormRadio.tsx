import React, { forwardRef, InputHTMLAttributes, ReactNode, useContext, useRef } from 'react'
import { AriaRadioProps, useRadio } from 'react-aria'

import { useForkedRef } from '../../utils/hooks'
import { ContextColor } from '../Types'

import { CxRadioGroupContext } from './context'
import { ButtonObject, renderFormCheckControl } from './formCheckRender'

export interface CxFormRadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'onChange' | 'size'
> {
  /**
   * Create button-like radios. Combine with `<CxFormRadioGroup>` to build radio toggle-button groups.
   */
  button?: ButtonObject
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context of the radio indicator to one of Chassis themed colors. Ignored when `button` is set.
   */
  context?: ContextColor
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
   * The value of the radio button, used to identify it within its `<CxFormRadioGroup>`.
   */
  value: string
}

// `<CxFormRadio>` must be rendered inside a `<CxFormRadioGroup>` — react-aria has no standalone
// radio hook, only useRadio(props, RadioGroupState, ref), because a lone radio with no group is
// not a meaningful accessible control (see https://chassis-ui.com/css/docs/forms/checkbox-radio).
export const CxFormRadio = forwardRef<HTMLInputElement, CxFormRadioProps>(
  ({ button, className, context, disabled, id, label, size, ...rest }, ref) => {
    const groupState = useContext(CxRadioGroupContext)

    if (!groupState) {
      throw new Error('CxFormRadio must be rendered inside a CxFormRadioGroup.')
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

    return renderFormCheckControl({
      button,
      className,
      context,
      input: <input {...inputProps} id={id} ref={forkedRef} />,
      label,
      size
    })
  }
)

CxFormRadio.displayName = 'CxFormRadio'
