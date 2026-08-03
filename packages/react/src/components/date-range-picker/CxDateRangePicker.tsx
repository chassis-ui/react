import React, { HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { FocusScope, mergeProps, RangeValue, useDateRangePicker, useDialog } from 'react-aria'
import { DateValue, useDateRangePickerState } from 'react-stately'

import { useFormField } from '../../hooks'
import { renderFormField } from '../form-field/renderFormField'
import { CxDateRangePreset } from '../calendar/dateRangePresets'
import { CxRangeCalendar } from '../calendar/CxRangeCalendar'
import { mergeIsDateUnavailable } from '../calendar/mergeIsDateUnavailable'
import { CalendarToggleButton } from '../datepicker/CalendarToggleButton'
import { DateField } from '../datepicker/DateField'
import { useOverlayPlacement } from '../datepicker/useOverlayPlacement'
import '../datepicker/CxDatePicker.css'
import './CxDateRangePicker.css'

export interface CxDateRangePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the date range picker, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the date range picker.
   */
  'aria-labelledby'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null
  /**
   * Prevents the date range picker from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * The day that starts the week in the calendar popover, overriding the default set by the
   * active locale.
   *
   * @default 'mon'
   */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  /**
   * A description for the field, rendered below the date range picker.
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
   * An error message for the field, rendered below the date range picker when `invalid` is set.
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
   * Base `name` for a pair of auto-created hidden inputs, kept in sync with the selection, for
   * native form submission — rendered as `${name}Start` and `${name}End`. Omit to skip creating
   * them.
   */
  name?: string
  /**
   * Callback fired when the selected date range changes.
   */
  onChange?: (value: RangeValue<DateValue> | null) => void
  /**
   * A list of quick-select range presets shown in the popover next to the calendar. Selecting a
   * preset commits its range immediately, the same as picking a start and end date from the
   * calendar. The preset matching the current selection (if any) is marked selected. Omit to not
   * show a preset list.
   */
  presets?: CxDateRangePreset[]
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   * Applies to both the calendar popover and typing a date directly into either field.
   */
  unavailableDates?: string[]
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the date range picker when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The selected date range (controlled).
   */
  value?: RangeValue<DateValue> | null
  /**
   * Number of months to display side by side in the calendar popover.
   *
   * @default 1
   */
  visibleMonths?: number
}

// Mirrors `CxDatePicker` closely — same field/popover/dialog composition, just with two
// segmented fields (`startFieldProps`/`endFieldProps` in place of a single `fieldProps`) and
// `CxRangeCalendar` in place of `CxCalendar` in the popover, dialog role/ref landing directly on
// it exactly as `CxCalendar` does for `CxDatePicker`. `presets` is passed straight through —
// `CxRangeCalendar` owns rendering and selecting them (it's also usable standalone), so completing
// one goes through the same `state.setValue`/`onChange` path a two-click grid selection does,
// which is what closes this popover automatically.
export const CxDateRangePicker = ({
  className,
  defaultValue,
  disabled,
  firstDayOfWeek,
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
  presets,
  size,
  unavailableDates,
  valid,
  validFeedback,
  value,
  visibleMonths,
  ...rest
}: CxDateRangePickerProps) => {
  const combinedIsDateUnavailable = mergeIsDateUnavailable(unavailableDates, isDateUnavailable)

  const state = useDateRangePickerState({
    defaultValue,
    isDateUnavailable: combinedIsDateUnavailable,
    isDisabled: disabled,
    maxValue,
    minValue,
    onChange,
    value
  })

  const groupRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const {
    describedBy,
    feedbackId,
    helpId,
    inputId: groupId,
    labelId,
    labelledBy
  } = useFormField({
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

  const { groupProps, startFieldProps, endFieldProps, buttonProps, calendarProps, dialogProps } =
    useDateRangePicker(
      {
        'aria-label': rest['aria-label'],
        'aria-labelledby': labelledBy,
        defaultValue,
        id: groupId,
        isDateUnavailable: combinedIsDateUnavailable,
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

  const { overlayStyle, placementAttr, popoverDismissProps } = useOverlayPlacement({
    popoverRef,
    state,
    triggerRef: groupRef
  })

  const { dialogProps: domDialogProps } = useDialog(dialogProps, calendarRef)

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
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          ref={groupRef}
        >
          <div className="d-flex w-100">
            <DateField fieldProps={startFieldProps} />
            <span aria-hidden="true" className="cx-daterangepicker-separator">
              –
            </span>
            <DateField fieldProps={endFieldProps} />
          </div>
          <CalendarToggleButton buttonProps={buttonProps} state={state} />
        </div>
        <div
          className="datepicker"
          data-cx-placement={placementAttr}
          hidden={!state.isOpen}
          ref={popoverRef}
          {...popoverDismissProps}
          style={overlayStyle}
        >
          {state.isOpen && (
            <FocusScope contain restoreFocus>
              <CxRangeCalendar
                {...domDialogProps}
                autoFocus
                disabled={disabled}
                firstDayOfWeek={firstDayOfWeek}
                isDateUnavailable={combinedIsDateUnavailable}
                maxValue={maxValue}
                minValue={minValue}
                onChange={calendarProps.onChange}
                presets={presets}
                ref={calendarRef}
                value={calendarProps.value}
                visibleMonths={visibleMonths}
              />
            </FocusScope>
          )}
        </div>
        {name && (
          <>
            <input
              disabled={disabled}
              name={`${name}Start`}
              type="hidden"
              value={state.value?.start ? state.value.start.toString() : ''}
            />
            <input
              disabled={disabled}
              name={`${name}End`}
              type="hidden"
              value={state.value?.end ? state.value.end.toString() : ''}
            />
          </>
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

CxDateRangePicker.displayName = 'CxDateRangePicker'
