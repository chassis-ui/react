import React, { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { AriaTimeFieldProps, mergeProps, TimeValue, useLocale, useTimeField } from 'react-aria'
import { useTimeFieldState } from 'react-stately'

import { useForkedRef, useFormField } from '../../hooks'
import { withoutSlotIds } from '../../utils/idRefs'
import { validationClassName } from '../../utils/validationClassName'
import { DateSegment } from '../datepicker/DateSegment'
import { renderFormField } from '../form-field/renderFormField'

export interface TimeFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  /**
   * An accessible label for the field, used when there's no visible `label`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible element that labels the field.
   */
  'aria-labelledby'?: string
  /**
   * Focus the first segment when the field mounts.
   */
  autoFocus?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The value of the field, uncontrolled.
   */
  defaultValue?: TimeValue | null
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The id of a form elsewhere on the page that the field belongs to.
   */
  form?: string
  /**
   * The smallest unit shown and edited.
   *
   * @default 'minute'
   */
  granularity?: 'hour' | 'minute' | 'second'
  /**
   * A description for the field, rendered below it.
   */
  help?: ReactNode
  /**
   * Hide the time zone of a `ZonedDateTime` value.
   */
  hideTimeZone?: boolean
  /**
   * Show 12 or 24 hours. Defaults to the locale's.
   */
  hourCycle?: 12 | 24
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below it when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` that names the field.
   */
  label?: ReactNode
  /**
   * The latest time. A later one entered marks the field invalid.
   */
  maxValue?: TimeValue | null
  /**
   * The earliest time. An earlier one entered marks the field invalid.
   */
  minValue?: TimeValue | null
  /**
   * The name the value is submitted under with a form, as an ISO 8601 time (`09:30:00`).
   */
  name?: string
  /**
   * Handler that is called when the value changes: once every segment has a value, and with
   * `null` once every segment is empty. A partly emptied field keeps its last value.
   */
  onChange?: (value: TimeValue | null) => void
  /**
   * The time the segments start from when the field is empty, such as `new Time(9)`. It also
   * sets the type of value `onChange` receives.
   */
  placeholderValue?: TimeValue
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Toggle the required state for the component.
   */
  required?: boolean
  /**
   * Show a leading zero on the hour, as `09:30` rather than `9:30`, whatever the locale does.
   */
  shouldForceLeadingZeros?: boolean
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below it when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The value of the field, controlled: a `Time`, or a `CalendarDateTime` or `ZonedDateTime`
   * whose date is kept. `null` for an empty field.
   */
  value?: TimeValue | null
}

type FieldProps = AriaTimeFieldProps<TimeValue>

// A time as `DateField` renders a date for the date pickers: a `.form-input` holding one editable
// segment per unit, with the segments' styles shared (`DateSegment`). The `.form-input` is the
// field's group, named by the label; each segment is a spin button named by its unit and the
// label.
export const TimeField = forwardRef<HTMLDivElement, TimeFieldProps>(
  (
    {
      autoFocus,
      className,
      defaultValue,
      disabled,
      form,
      granularity,
      help,
      hideTimeZone,
      hourCycle,
      id,
      invalid,
      invalidFeedback,
      label,
      maxValue,
      minValue,
      name,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onKeyUp,
      placeholderValue,
      readOnly,
      required,
      shouldForceLeadingZeros,
      size,
      valid,
      validFeedback,
      value,
      ...rest
    },
    ref
  ) => {
    const fieldRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, fieldRef)
    const inputRef = useRef<HTMLInputElement>(null)
    const { locale } = useLocale()

    // `label` stays out, as the other fields keep it: react-aria would name the field by a label
    // element of its own, which this component doesn't render.
    // `inputRef` is the hidden input's: react-aria resets the field with that input's form and
    // reports validity through it, as react-aria-components passes it, outside the public type.
    const baseProps: FieldProps & { inputRef: typeof inputRef } = {
      'aria-label': rest['aria-label'],
      autoFocus,
      defaultValue,
      form,
      granularity,
      hideTimeZone,
      hourCycle,
      inputRef,
      isDisabled: disabled,
      // `false` would override react-aria's own range check: react-stately takes a defined
      // `isInvalid` as the whole validation state.
      isInvalid: invalid || undefined,
      isReadOnly: readOnly,
      isRequired: required,
      maxValue,
      minValue,
      name,
      onBlur: onBlur as FieldProps['onBlur'],
      onChange,
      onFocus: onFocus as FieldProps['onFocus'],
      onKeyDown: onKeyDown as FieldProps['onKeyDown'],
      onKeyUp: onKeyUp as FieldProps['onKeyUp'],
      placeholderValue,
      shouldForceLeadingZeros,
      value
    }
    const state = useTimeFieldState({ ...baseProps, locale })
    // A time outside `minValue`/`maxValue` is invalid too, shown as `invalid` is: the state
    // knows before the ids are built, so the feedback describes the field either way.
    const showInvalid = invalid || state.displayValidation.isInvalid
    // A time outside the range isn't valid, whatever `valid` says.
    const showValid = valid && !showInvalid

    const { describedBy, feedbackId, helpId, inputId, labelId, labelledBy } = useFormField({
      ariaDescribedBy: rest['aria-describedby'],
      ariaLabelledBy: rest['aria-labelledby'],
      help,
      id,
      invalid: showInvalid,
      invalidFeedback,
      label,
      valid: showValid,
      validFeedback
    })

    const {
      descriptionProps,
      errorMessageProps,
      fieldProps: groupProps,
      inputProps
    } = useTimeField(
      { ...baseProps, 'aria-describedby': describedBy, 'aria-labelledby': labelledBy, id: inputId },
      state,
      fieldRef
    )

    // The field's `aria-describedby` from react-aria holds its description of the value, added
    // once mounted, and the help and feedback given to it; the slot ids come out (FORMS.md, gotcha
    // 6). It's set again after the spread, where the caller's own value would replace it (gotcha
    // 4).
    const group = withoutSlotIds(groupProps, descriptionProps, errorMessageProps)

    return renderFormField({
      children: (
        <>
          <div
            {...mergeProps(group, rest)}
            aria-describedby={group['aria-describedby']}
            aria-labelledby={labelledBy}
            className={classNames(
              'form-input',
              'time-field',
              size,
              { disabled },
              validationClassName(showInvalid, showValid),
              className
            )}
            ref={forkedRef}
            style={{ ...group.style, ...rest.style }}
          >
            <div className="datepicker-field">
              {state.segments.map((segment, index) => (
                <DateSegment
                  fieldLabelledBy={labelledBy}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  segment={segment}
                  slots={[descriptionProps, errorMessageProps]}
                  state={state}
                />
              ))}
            </div>
          </div>
          <input {...inputProps} ref={inputRef} />
        </>
      ),
      help,
      ids: { feedback: feedbackId, help: helpId, label: labelId },
      invalid: showInvalid,
      invalidFeedback,
      label,
      valid: showValid,
      validFeedback
    })
  }
)

TimeField.displayName = 'TimeField'
