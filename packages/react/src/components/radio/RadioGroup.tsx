import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'
import { AriaRadioGroupProps, useRadioGroup } from 'react-aria'
import { RadioGroupProps as StatelyRadioGroupProps, useRadioGroupState } from 'react-stately'

import { validationClassName } from '../../utils/validationClassName'

import { RadioGroupContext } from './context'
import { FormFeedback } from '../form/FormFeedback'
import { FormHelp } from '../form/FormHelp'
import { Flex } from '../flex'

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  'defaultValue' | 'onChange'
> {
  /**
   * One or more `<Radio>` elements.
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

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
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

    const state = useRadioGroupState(groupProps as StatelyRadioGroupProps)
    const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } = useRadioGroup(
      groupProps as AriaRadioGroupProps,
      state
    )

    const _className = classNames('form-field', validationClassName(invalid, valid), className)

    const items = (
      <RadioGroupContext.Provider value={{ state, valid }}>{children}</RadioGroupContext.Provider>
    )

    return (
      <fieldset {...rest} {...radioGroupProps} className={_className} ref={ref}>
        {label && (
          <legend className="form-label" {...labelProps}>
            {label}
          </legend>
        )}
        {orientation === 'horizontal' ? <Flex gap="medium">{items}</Flex> : items}
        {description && <FormHelp {...descriptionProps}>{description}</FormHelp>}
        {invalid && errorMessage && (
          <FormFeedback invalid {...errorMessageProps}>
            {errorMessage}
          </FormFeedback>
        )}
      </fieldset>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'
