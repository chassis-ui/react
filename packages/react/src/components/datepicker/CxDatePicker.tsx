import React, { HTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import { mergeProps, useButton, useDatePicker, useLocale, useOverlayPosition } from 'react-aria'
import { DateValue, useCalendarState, useDatePickerState } from 'react-stately'
import { createCalendar } from '@internationalized/date'

import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { DateField } from './DateField'
import { Calendar } from './Calendar'
import './CxDatePicker.css'

export interface CDatePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
   * `id` forwarded to the field's grouping element — useful for pairing with a `<label for>`.
   */
  id?: string
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue) => boolean
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
   * The selected date (controlled).
   */
  value?: DateValue | null
}

export const CxDatePicker = ({
  className,
  defaultValue,
  disabled,
  id,
  isDateUnavailable,
  maxValue,
  minValue,
  name,
  onChange,
  size,
  value,
  ...rest
}: CDatePickerProps) => {
  const { locale } = useLocale()

  const state = useDatePickerState({
    defaultValue,
    isDateUnavailable,
    isDisabled: disabled,
    maxValue,
    minValue,
    onChange,
    value,
  })

  const groupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const { groupProps, fieldProps, buttonProps, calendarProps, dialogProps } = useDatePicker(
    {
      'aria-label': rest['aria-label'],
      'aria-labelledby': rest['aria-labelledby'],
      defaultValue,
      id,
      isDateUnavailable,
      isDisabled: disabled,
      maxValue,
      minValue,
      onChange,
      value,
    },
    state,
    groupRef,
  )

  const { buttonProps: toggleProps } = useButton(buttonProps, buttonRef)

  const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
    targetRef: groupRef,
    overlayRef: popoverRef,
    placement: toAriaPlacement('bottom-start'),
    offset: 2,
    isOpen: state.isOpen,
  })

  const overlayStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left,
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  const calendarState = useCalendarState({
    ...calendarProps,
    createCalendar,
    locale,
    visibleDuration: { months: 1 },
  })

  return (
    <>
      <div
        className={classNames(
          'form-input',
          { small: size === 'small', large: size === 'large', disabled },
          className,
        )}
        {...mergeProps(groupProps, rest)}
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
  )
}

CxDatePicker.displayName = 'CxDatePicker'
