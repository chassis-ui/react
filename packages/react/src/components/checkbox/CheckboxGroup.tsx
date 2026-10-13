import React, { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { AriaCheckboxGroupProps, useCheckboxGroup } from 'react-aria'
import { useCheckboxGroupState } from 'react-stately'

import { useForkedRef, useHeldBack } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { joinIds } from '../../utils/idRefs'

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
   * An error message for the group, rendered below the options when `invalid` is set, and after
   * a submit the group held back, until it no longer would.
   */
  errorMessage?: ReactNode
  /**
   * The id of the `<form>` the group belongs to, for a group rendered outside it. Reaches every
   * checkbox; a `Checkbox` with its own `form` keeps it.
   */
  form?: string
  /**
   * Set group validation state to invalid. Left unset, the group shows as invalid by itself
   * from a submit it held back (an empty `required` one, say) until it no longer would, or its
   * form is reset. Set it, to `false` too, and it alone decides.
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
   * Requires at least one checkbox of the group. While none is selected each carries the native
   * `required`, so a form isn't submitted until one is; a `Checkbox` with its own `required`
   * stays required whatever the others are.
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
      form,
      invalid: invalidProp,
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
    const fieldsetRef = useRef<HTMLFieldSetElement>(null)
    const forkedRef = useForkedRef(ref, fieldsetRef)
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`):
    // react-aria cancels the browser's own message, and the form stayed with nothing to say why.
    // The fieldset hears every checkbox, and the group shows it for them all, with `errorMessage`.
    const { invalid } = useHeldBack(fieldsetRef, { invalid: invalidProp, valid })

    const groupProps = {
      ...rest,
      defaultValue,
      description,
      errorMessage,
      form,
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

    // Only the ids this group renders. react-aria's own describe the group and every item by a
    // description and an error message whether or not they exist (FORMS.md, gotcha 6).
    const describedBy = joinIds(
      Boolean(description) && descriptionProps.id,
      Boolean(invalid && errorMessage) && errorMessageProps.id
    )

    const items = (
      <CheckboxGroupContext.Provider value={{ describedBy, state, valid }}>
        {children}
      </CheckboxGroupContext.Provider>
    )

    return (
      <fieldset
        {...rest}
        {...ariaGroupProps}
        aria-describedby={joinIds(describedBy, rest['aria-describedby'])}
        className={_className}
        // The fieldset's own form owner. react-aria hands the group's `form` to each of its
        // checkboxes, under one that has its own.
        form={form}
        ref={forkedRef}
      >
        {label && (
          <legend className="form-label" {...labelProps}>
            {label}
          </legend>
        )}
        {orientation === 'horizontal' ? (
          <Flex wrap="wrap" gap="md">
            {items}
          </Flex>
        ) : (
          items
        )}
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
