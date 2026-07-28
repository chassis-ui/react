import React, { HTMLAttributes, ReactNode, useId, useRef } from 'react'
import classNames from 'classnames'
import { mergeProps, useButton, useDatePicker, useLocale, useOverlayPosition } from 'react-aria'
import { DateValue, useCalendarState, useDatePickerState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { renderFormField } from '../form-field/renderFormField'
import { DateField } from './DateField'
import { Calendar } from './Calendar'
import './CxDatePicker.css'

export interface CxDatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the date picker, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the date picker.
   */
  'aria-labelledby'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial selected date (uncontrolled).
   */
  defaultValue?: DateValue | null
  /**
   * Prevents the date picker from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the date picker.
   */
  help?: ReactNode
  /**
   * `id` forwarded to the field's grouping element — useful for pairing with a `<label for>`.
   */
  id?: string
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the date picker when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue) => boolean
  /**
   * The field's caption, rendered as a `CxFormLabel` associated with the field group.
   */
  label?: ReactNode
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue | null
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue | null
  /**
   * `name` of an auto-created hidden input, kept in sync with the selection, for native form
   * submission. Omit to skip creating one.
   */
  name?: string
  /**
   * Callback fired when the selected date changes.
   */
  onChange?: (value: DateValue | null) => void
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the date picker when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The selected date (controlled).
   */
  value?: DateValue | null
}

export const CxDatePicker = ({
  className,
  defaultValue,
  disabled,
  help,
  id,
  invalid,
  invalidFeedback,
  isDateUnavailable,
  label,
  maxValue,
  minValue,
  name,
  onChange,
  size,
  valid,
  validFeedback,
  value,
  ...rest
}: CxDatePickerProps) => {
  const { locale } = useLocale()

  const state = useDatePickerState({
    defaultValue,
    isDateUnavailable,
    isDisabled: disabled,
    maxValue,
    minValue,
    onChange,
    value
  })

  const groupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const generatedId = useId()
  const groupId = id ?? generatedId
  const labelId = `${generatedId}-label`
  const helpId = `${generatedId}-help`
  const feedbackId = `${generatedId}-feedback`

  const showInvalidFeedback = invalid && invalidFeedback
  const showValidFeedback = valid && validFeedback
  const describedBy = [
    help && helpId,
    (showInvalidFeedback || showValidFeedback) && feedbackId,
    rest['aria-describedby']
  ]
    .filter(Boolean)
    .join(' ')
  const labelledBy = [label && labelId, rest['aria-labelledby']].filter(Boolean).join(' ')

  const { groupProps, fieldProps, buttonProps, calendarProps, dialogProps } = useDatePicker(
    {
      'aria-label': rest['aria-label'],
      'aria-labelledby': labelledBy || undefined,
      defaultValue,
      id: groupId,
      isDateUnavailable,
      isDisabled: disabled,
      isInvalid: invalid,
      maxValue,
      minValue,
      onChange,
      value
    },
    state,
    groupRef
  )

  const { buttonProps: toggleProps } = useButton(buttonProps, buttonRef)

  const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
    targetRef: groupRef,
    overlayRef: popoverRef,
    placement: toAriaPlacement('bottom-start'),
    offset: 2,
    isOpen: state.isOpen
  })

  const overlayStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  const calendarState = useCalendarState({
    ...calendarProps,
    createCalendar,
    locale,
    visibleDuration: { months: 1 }
  })

  return renderFormField({
    children: (
      <>
        <div
          className={classNames(
            'form-input',
            { small: size === 'small', large: size === 'large', disabled },
            { 'is-invalid': invalid, 'is-valid': valid },
            className
          )}
          {...mergeProps(groupProps, rest)}
          aria-describedby={describedBy || undefined}
          aria-labelledby={labelledBy || undefined}
          ref={groupRef}
        >
          <DateField fieldProps={fieldProps} />
          <button {...toggleProps} className="input-help" ref={buttonRef} type="button">
            <svg
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                height="12"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.25"
                width="13"
                x="1.5"
                y="3"
              />
              <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.25" />
              <path
                d="M4.5 1.5v3M11.5 1.5v3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.25"
              />
            </svg>
          </button>
        </div>
        <div
          className="cx-datepicker-calendar"
          data-cx-placement={placementAttr}
          hidden={!state.isOpen}
          ref={popoverRef}
          style={overlayStyle}
        >
          {state.isOpen && (
            <Calendar
              calendarRef={calendarRef}
              dialogProps={dialogProps}
              locale={locale}
              props={{}}
              state={calendarState}
            />
          )}
        </div>
        {name && (
          <input
            disabled={disabled}
            name={name}
            type="hidden"
            value={state.value ? state.value.toString() : ''}
          />
        )}
      </>
    ),
    help,
    ids: { feedback: feedbackId, help: helpId, label: labelId },
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })
}

CxDatePicker.displayName = 'CxDatePicker'
