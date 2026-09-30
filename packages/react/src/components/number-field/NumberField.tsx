import React, { forwardRef, InputHTMLAttributes, ReactNode, RefObject, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaButtonProps,
  AriaNumberFieldProps,
  mergeProps,
  useButton,
  useLocale,
  useNumberField
} from 'react-aria'
import { useNumberFieldState } from 'react-stately'

import './NumberField.scss'
import { useForkedRef, useFormField } from '../../hooks'
import { IconValue } from '../../utils/iconConfig'
import { IconSlot } from '../../utils/iconSlot'
import { mergeUnhandledProps, TEXT_FIELD_PROPS } from '../../utils/unhandledProps'
import { validationClassName } from '../../utils/validationClassName'
import { useHydrated } from '../portal/Portal'
import { renderFormField } from '../form-field/renderFormField'

export interface NumberFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'inputMode' | 'max' | 'min' | 'onChange' | 'size' | 'step' | 'type' | 'value'
> {
  /**
   * Content rendered at the input's trailing edge, before the step buttons, e.g. a unit as an
   * `InputAdorn`.
   */
  adornEnd?: ReactNode
  /**
   * Content rendered at the input's leading edge, e.g. an `InputAdorn` icon or text.
   */
  adornStart?: ReactNode
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The name of the decrement button for screen readers. Defaults to "Decrease" and the field's
   * label, in the locale's language.
   */
  decrementAriaLabel?: string
  /**
   * The decrement button's icon, in place of `IconProvider`'s `decrement`.
   */
  decrementIcon?: IconValue
  /**
   * The value of the field, uncontrolled.
   */
  defaultValue?: number
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * How the value is shown and typed: decimals, a percent, a currency or a unit, with the
   * locale's separators. `Intl.NumberFormat`'s options.
   */
  formatOptions?: Intl.NumberFormatOptions
  /**
   * A description for the field, rendered below the input.
   */
  help?: ReactNode
  /**
   * The name of the increment button for screen readers. Defaults to "Increase" and the field's
   * label, in the locale's language.
   */
  incrementAriaLabel?: string
  /**
   * The increment button's icon, in place of `IconProvider`'s `increment`.
   */
  incrementIcon?: IconValue
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the input when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with this input.
   */
  label?: ReactNode
  /**
   * The largest value. A larger one typed in is clamped to it when the field loses focus.
   */
  max?: number
  /**
   * The smallest value. A smaller one typed in is clamped to it when the field loses focus.
   */
  min?: number
  /**
   * Handler that is called when the value is committed: on a step (a button, an arrow key, Home,
   * End, the mouse wheel), on Enter or when the field loses focus after typing, on a paste that
   * replaces the whole text, and on a form reset. `NaN` when the field is empty.
   */
  onChange?: (value: number) => void
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Toggle the required state for the component.
   */
  required?: boolean
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * The amount the buttons and the arrow keys add or take away. A typed value snaps to it,
   * counted from `min`.
   *
   * @default 1
   */
  step?: number
  /**
   * Show the increment and decrement buttons. Without them the arrow keys still step the value.
   *
   * @default true
   */
  stepButtons?: boolean
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the input when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The value of the field, controlled. `NaN` for an empty field.
   */
  value?: number
}

// One step button. A `<button>` react-aria keeps out of the tab order: the input's arrow keys do
// the same. A mouse press leaves focus on the input; a touch focuses the button, so no software
// keyboard opens.
function StepButton({
  buttonProps,
  className,
  icon,
  iconKey
}: {
  buttonProps: AriaButtonProps
  className: string
  icon?: IconValue
  iconKey: 'increment' | 'decrement'
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps: props } = useButton(buttonProps, ref as RefObject<HTMLButtonElement | null>)
  return (
    <button {...props} className={className} ref={ref}>
      <IconSlot icon={iconKey} override={icon} />
    </button>
  )
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      adornEnd,
      adornStart,
      className,
      decrementAriaLabel,
      decrementIcon,
      defaultValue,
      disabled,
      form,
      formatOptions,
      help,
      id,
      incrementAriaLabel,
      incrementIcon,
      invalid,
      invalidFeedback,
      label,
      max,
      min,
      name,
      onChange,
      readOnly,
      required,
      size,
      step,
      stepButtons = true,
      style,
      valid,
      validFeedback,
      value,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)
    const hydrated = useHydrated()
    const { locale } = useLocale()

    const { describedBy, feedbackId, helpId, inputId, labelId, labelledBy } = useFormField({
      ariaDescribedBy: rest['aria-describedby'],
      ariaLabelledBy: rest['aria-labelledby'],
      help,
      id,
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })

    // `label` stays out: react-aria would label the input and the buttons with a label element of
    // its own, which this component doesn't render. The buttons are named from `aria-labelledby`,
    // which names the `FormLabel` (FORMS.md, gotcha 5).
    const fieldProps = {
      ...rest,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy,
      decrementAriaLabel,
      defaultValue,
      formatOptions,
      id: inputId,
      incrementAriaLabel,
      isDisabled: disabled,
      isInvalid: invalid,
      isReadOnly: readOnly,
      isRequired: required,
      maxValue: max,
      minValue: min,
      onChange,
      step,
      value
    } as AriaNumberFieldProps
    const state = useNumberFieldState({ ...fieldProps, locale })
    const { decrementButtonProps, groupProps, incrementButtonProps, inputProps } = useNumberField(
      fieldProps,
      state,
      inputRef
    )

    const hasWrapper = stepButtons || adornStart != null || adornEnd != null

    // react-aria picks the keyboard (`inputMode`) and drops `aria-roledescription` by platform
    // (iPhone, Android, iOS), which the server can't know, and a hydrating render doesn't patch an
    // attribute. Until the page has hydrated, both are what the server renders: `numeric`, which
    // any platform but those picks, and no role description, whose text iOS doesn't get.
    // `aria-describedby` after the spread: react-aria's own adds ids it never renders (FORMS.md,
    // gotcha 6).
    // react-aria's focus-within handlers let the mouse wheel step the value while the field has
    // focus: on the wrapper when there is one, else on the input. The wrapper isn't a named group.
    const focusWithin = { onBlur: groupProps.onBlur, onFocus: groupProps.onFocus }
    // `form` reaches the visible input too, which has no `name`: react-aria resets the field on
    // the reset of the input's own form, and a form linked by id is the input's form only then.
    const input = (
      <input
        {...mergeUnhandledProps(
          hasWrapper ? inputProps : mergeProps(inputProps, focusWithin),
          rest,
          TEXT_FIELD_PROPS
        )}
        aria-describedby={describedBy}
        // react-aria's spin button props repeat the native `disabled` and `readOnly` the text
        // field sets; the Nu Html Checker flags the copies.
        aria-disabled={undefined}
        aria-readonly={undefined}
        aria-roledescription={hydrated ? inputProps['aria-roledescription'] : undefined}
        className={classNames(
          hasWrapper ? 'ghost-input' : 'form-input',
          !hasWrapper && size,
          validationClassName(invalid, valid),
          !hasWrapper && className
        )}
        form={form}
        inputMode={hydrated ? inputProps.inputMode : 'numeric'}
        ref={forkedRef}
        style={hasWrapper ? undefined : style}
      />
    )

    // The step buttons sit in their own element: chassis-css styles `.form-input` as disabled when
    // one of its direct children is, and a step button is disabled at `min` or `max`.
    const field = hasWrapper ? (
      <div
        className={classNames('form-input', 'number-field', size, className)}
        style={style}
        {...focusWithin}
      >
        {adornStart}
        {input}
        {adornEnd}
        {stepButtons && (
          <div className="number-field-buttons">
            <StepButton
              buttonProps={incrementButtonProps}
              className="number-field-increment"
              icon={incrementIcon}
              iconKey="increment"
            />
            <StepButton
              buttonProps={decrementButtonProps}
              className="number-field-decrement"
              icon={decrementIcon}
              iconKey="decrement"
            />
          </div>
        )}
      </div>
    ) : (
      input
    )

    // The input shows the formatted text; a form receives the number, from a hidden input as
    // react-aria-components' `NumberField` renders it.
    const children = name ? (
      <>
        {field}
        <input
          disabled={disabled || undefined}
          form={form}
          name={name}
          type="hidden"
          value={isNaN(state.numberValue) ? '' : state.numberValue}
        />
      </>
    ) : (
      field
    )

    return renderFormField({
      children,
      help,
      ids: { feedback: feedbackId, help: helpId, input: inputId, label: labelId },
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })
  }
)

NumberField.displayName = 'NumberField'
