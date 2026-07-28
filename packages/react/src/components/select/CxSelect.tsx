import React, { ChangeEventHandler, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { useFormField } from '../../hooks'
import { renderFormField } from '../form-field/renderFormField'

type Option = {
  disabled?: boolean
  label?: string
  value?: string
}
export interface CxSelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * A description for the field, rendered below the select.
   */
  help?: ReactNode
  /**
   * Specifies the number of visible options in a drop-down list.
   */
  htmlSize?: number
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the select when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `CxFormLabel` associated with this select.
   */
  label?: ReactNode
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLSelectElement>
  /**
   * Options list of the select component. Available keys: `label`, `value`, `disabled`.
   * Examples:
   * - `options={[{ value: 'js', label: 'JavaScript' }, { value: 'html', label: 'HTML', disabled: true }]}`
   * - `options={['js', 'html']}`
   */
  options?: Option[] | string[]
  /**
   * Renders a disabled placeholder option as the first item (e.g. `"Select a country…"`).
   * The option has an empty value so it is not selectable once another option is chosen.
   */
  placeholder?: string
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the select when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: string | string[] | number
}

export const CxSelect = forwardRef<HTMLSelectElement, CxSelectProps>(
  (
    {
      children,
      className,
      help,
      htmlSize,
      id,
      invalid,
      invalidFeedback,
      label,
      options,
      placeholder,
      size,
      valid,
      validFeedback,
      ...rest
    },
    ref
  ) => {
    const { describedBy, feedbackId, helpId, inputId } = useFormField({
      ariaDescribedBy: rest['aria-describedby'],
      help,
      id,
      invalid,
      invalidFeedback,
      valid,
      validFeedback
    })

    const _className = classNames(
      'form-input',
      size,
      {
        'is-invalid': invalid,
        'is-valid': valid
      },
      className
    )

    return renderFormField({
      children: (
        <select
          {...rest}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={_className}
          id={inputId}
          ref={ref}
          size={htmlSize}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((option, index) => {
                return (
                  <option
                    {...(typeof option === 'object' &&
                      option.disabled && { disabled: option.disabled })}
                    {...(typeof option === 'object' && option.value && { value: option.value })}
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                  >
                    {typeof option === 'string' ? option : option.label}
                  </option>
                )
              })
            : children}
        </select>
      ),
      help,
      ids: { feedback: feedbackId, help: helpId, input: inputId },
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })
  }
)

CxSelect.displayName = 'CxSelect'
