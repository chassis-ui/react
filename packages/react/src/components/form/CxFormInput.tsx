import React, { ChangeEventHandler, forwardRef, InputHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxFormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Render the component styled as plain text. Removes the default form field styling and preserve the correct margin and padding. Recommend to use only along side `readonly` [docs]
   */
  plainText?: boolean
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Specifies the type of component.
   */
  type?: 'color' | 'file' | 'text' | string
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: string | string[] | number
}

export const CxFormInput = forwardRef<HTMLInputElement, CxFormInputProps>(
  ({ className, invalid, plainText, size, type = 'text', valid, ...rest }, ref) => {
    const _className = classNames(
      plainText ? 'form-control-plaintext' : 'form-input',
      size,
      {
        'form-input-color': type === 'color',
        'is-invalid': invalid,
        'is-valid': valid,
      },
      className,
    )
    return <input type={type} className={_className} {...rest} ref={ref} />
  },
)

CxFormInput.displayName = 'CxFormInput'
