import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'
import { AriaRadioGroupProps, useRadioGroup } from 'react-aria'
import { RadioGroupProps, useRadioGroupState } from 'react-stately'

import { CxRadioGroupContext } from './context'
import { CxFormFeedback } from '../form/CxFormFeedback'
import { CxFormHelp } from '../form/CxFormHelp'

export interface CxRadioGroupProps extends Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  'defaultValue' | 'onChange'
> {
  /**
   * One or more `<CxRadio>` elements.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The selected value, uncontrolled.
   */
  defaultValue?: string
  /**
   * A description for the group, rendered below the options.
   */
  description?: ReactNode
  /**
   * Disables every radio in the group.
   */
  disabled?: boolean
  /**
   * An error message for the group, rendered below the options when `invalid` is set.
   */
  errorMessage?: ReactNode
  /**
   * Set group validation state to invalid.
   */
  invalid?: boolean
  /**
   * The group's caption, rendered as a `<legend>`.
   */
  label?: ReactNode
  /**
   * The name for the group, used for native form submission.
   */
  name?: string
  /**
   * Callback fired when the selected value changes.
   */
  onChange?: (value: string) => void
  /**
   * Lay the group's radios out on the same horizontal row instead of stacking them.
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Marks the group as required.
   */
  required?: boolean
  /**
   * Set group validation state to valid.
   */
  valid?: boolean
  /**
   * The selected value, controlled.
   */
  value?: string
}

export const CxRadioGroup = forwardRef<HTMLFieldSetElement, CxRadioGroupProps>(
  (
    {
      children,
      className,
      defaultValue,
      description,
      disabled,
      errorMessage,
      invalid,
      label,
      name,
      onChange,
      orientation,
      required,
      valid,
      value,
      ...rest
    },
    ref
  ) => {
    const groupProps = {
      ...rest,
      defaultValue,
      description,
      errorMessage,
      isDisabled: disabled,
      isInvalid: invalid,
      isRequired: required,
      label,
      name,
      onChange,
      orientation,
      value
    }

    const state = useRadioGroupState(groupProps as RadioGroupProps)
    const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } = useRadioGroup(
      groupProps as AriaRadioGroupProps,
      state
    )

    const _className = classNames(
      'form-field',
      {
        'is-invalid': invalid,
        'is-valid': valid
      },
      className
    )

    const items = (
      <CxRadioGroupContext.Provider value={state}>{children}</CxRadioGroupContext.Provider>
    )

    return (
      <fieldset {...rest} {...radioGroupProps} className={_className} ref={ref}>
        {label && (
          <legend className="form-label" {...labelProps}>
            {label}
          </legend>
        )}
        {orientation === 'horizontal' ? <div className="d-flex gap-medium">{items}</div> : items}
        {description && <CxFormHelp {...descriptionProps}>{description}</CxFormHelp>}
        {invalid && errorMessage && (
          <CxFormFeedback invalid {...errorMessageProps}>
            {errorMessage}
          </CxFormFeedback>
        )}
      </fieldset>
    )
  }
)

CxRadioGroup.displayName = 'CxRadioGroup'
