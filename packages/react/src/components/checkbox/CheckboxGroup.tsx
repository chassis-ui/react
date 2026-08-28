import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'
import { AriaCheckboxGroupProps, useCheckboxGroup } from 'react-aria'
import { useCheckboxGroupState } from 'react-stately'

import { validationClassName } from '../../utils/validationClassName'

import { CheckboxGroupContext } from './context'
import { FormFeedback } from '../form/FormFeedback'
import { FormHelp } from '../form/FormHelp'
import { Flex } from '../flex'

export interface CheckboxGroupProps extends Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  'defaultValue' | 'onChange'
> {
  /**
   * One or more `<Checkbox>` elements.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The selected values, uncontrolled.
   */
  defaultValue?: string[]
  /**
   * A description for the group, rendered below the options.
   */
  description?: ReactNode
  /**
   * Disables every checkbox in the group.
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
   * Callback fired when the selected values change.
   */
  onChange?: (value: string[]) => void
  /**
   * Lay the group's checkboxes out on the same horizontal row instead of stacking them.
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
   * The selected values, controlled.
   */
  value?: string[]
}

export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
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
      value
    }

    const state = useCheckboxGroupState(groupProps)
    const {
      groupProps: ariaGroupProps,
      labelProps,
      descriptionProps,
      errorMessageProps
    } = useCheckboxGroup(groupProps as AriaCheckboxGroupProps, state)

    const _className = classNames('form-field', validationClassName(invalid, valid), className)

    const items = (
      <CheckboxGroupContext.Provider value={{ state, valid }}>
        {children}
      </CheckboxGroupContext.Provider>
    )

    return (
      <fieldset {...rest} {...ariaGroupProps} className={_className} ref={ref}>
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

CheckboxGroup.displayName = 'CheckboxGroup'
