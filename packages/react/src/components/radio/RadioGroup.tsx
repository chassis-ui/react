import React, { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { AriaRadioGroupProps, useRadioGroup } from 'react-aria'
import { RadioGroupProps as StatelyRadioGroupProps, useRadioGroupState } from 'react-stately'

import { useForkedRef, useHeldBack } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { joinIds } from '../../utils/idRefs'
import { mergeUnhandledProps } from '../../utils/unhandledProps'

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
   * An error message for the group, rendered below the options when `invalid` is set, and after
   * a submit the group held back, until it no longer would.
   */
  errorMessage?: ReactNode
  /**
   * The id of the `<form>` the group belongs to, for a group rendered outside it. Reaches every
   * radio; a `Radio` with its own `form` keeps it.
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
   * Callback fired when the selected value changes.
   */
  onChange?: (value: string) => void
  /**
   * Lay the group's radios out on the same horizontal row instead of stacking them.
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Marks the group as required: `aria-required` on the group and the native `required` on its
   * radios, so a form isn't submitted until one of them is selected.
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
      form,
      invalid: invalidProp,
      label,
      name,
      onChange,
      orientation,
      required,
      valid: validProp,
      value,
      ...rest
    },
    ref
  ) => {
    const fieldsetRef = useRef<HTMLFieldSetElement>(null)
    const forkedRef = useForkedRef(ref, fieldsetRef)
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`):
    // react-aria cancels the browser's own message, and the form stayed with nothing to say why.
    // The fieldset hears every radio, and the group shows it for them all, with `errorMessage`.
    const { invalid, valid } = useHeldBack(fieldsetRef, { invalid: invalidProp, valid: validProp })

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
      orientation,
      value
    }

    const state = useRadioGroupState(groupProps as StatelyRadioGroupProps)
    const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } = useRadioGroup(
      groupProps as AriaRadioGroupProps,
      state
    )

    const _className = classNames('form-field', validationClassName(invalid, valid), className)

    // Only the ids this group renders. react-aria's own describe the group and every item by a
    // description and an error message whether or not they exist (FORMS.md, gotcha 6).
    const describedBy = joinIds(
      Boolean(description) && descriptionProps.id,
      Boolean(invalid && errorMessage) && errorMessageProps.id
    )

    const items = (
      <RadioGroupContext.Provider value={{ describedBy, state, valid }}>
        {children}
      </RadioGroupContext.Provider>
    )

    return (
      <fieldset
        {...mergeUnhandledProps(radioGroupProps, rest, ['onBlur', 'onFocus'])}
        aria-describedby={joinIds(describedBy, rest['aria-describedby'])}
        className={_className}
        // The fieldset's own form owner. react-aria hands the group's `form` to each of its
        // radios, under one that has its own.
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

RadioGroup.displayName = 'RadioGroup'
