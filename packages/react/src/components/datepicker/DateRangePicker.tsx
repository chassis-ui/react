import React, { forwardRef, HTMLAttributes, ReactNode, useMemo, useRef } from 'react'
import { mergeProps, RangeValue, useDateRangePicker, useDialog } from 'react-aria'
import { DateValue, useDateRangePickerState } from 'react-stately'

import { useForkedRef, useFormField, useOverlayPlacement } from '../../hooks'
import { DateRangePreset } from '../../utils/dateRangePresets'
import { mergeIsDateUnavailable } from '../../utils/mergeIsDateUnavailable'
import { renderFormField } from '../form-field/renderFormField'
import { RangeCalendar } from '../calendar/RangeCalendar'
import { CalendarToggleButton } from './CalendarToggleButton'
import { ClearButton } from './ClearButton'
import { DateField } from './DateField'
import { renderDatePickerShell } from './renderDatePickerShell'
import './DatePicker.scss'
import './DateRangePicker.scss'

export interface DateRangePickerProps extends Omit<
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
   * Whether the calendar popover is open by default (uncontrolled).
   *
   * @default false
   */
  defaultOpen?: boolean
  /**
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null
  /**
   * Prevents the date range picker from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * The day that starts the week in the calendar overlay, overriding the default set by the
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
   * Whether the calendar popover is open (controlled).
   */
  isOpen?: boolean
  /**
   * The field's caption, rendered as a `FormLabel` associated with the field group.
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
   * Callback fired when the calendar popover's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void
  /**
   * A list of quick-select range presets shown in the overlay next to the calendar. Selecting a
   * preset commits its range immediately, the same as picking a start and end date from the
   * calendar. The preset matching the current selection (if any) is marked selected. Omit to not
   * show a preset list.
   */
  presets?: DateRangePreset[]
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   * Applies to both the calendar overlay and typing a date directly into either field.
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
   * Number of months to display side by side in the calendar overlay.
   *
   * @default 1
   */
  visibleMonths?: number
}

// Mirrors `DatePicker` closely — same field/overlay/dialog composition, just with two
// segmented fields (`startFieldProps`/`endFieldProps` in place of a single `fieldProps`) and
// `RangeCalendar` in place of `Calendar` in the overlay, dialog role/ref landing directly on
// it exactly as `Calendar` does for `DatePicker`. `presets` is passed straight through —
// `RangeCalendar` owns rendering and selecting them (it's also usable standalone), so completing
// one goes through the same `state.setValue`/`onChange` path a two-click grid selection does,
// which is what closes this overlay automatically.
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      className,
      defaultOpen,
      defaultValue,
      disabled,
      firstDayOfWeek,
      help,
      id,
      invalid,
      invalidFeedback,
      isDateUnavailable,
      isOpen,
      label,
      maxValue,
      minValue,
      name,
      onChange,
      onOpenChange,
      presets,
      size,
      unavailableDates,
      valid,
      validFeedback,
      value,
      visibleMonths,
      ...rest
    }: DateRangePickerProps,
    ref
  ): ReactNode => {
    const combinedIsDateUnavailable = useMemo(
      () => mergeIsDateUnavailable(unavailableDates, isDateUnavailable),
      [unavailableDates, isDateUnavailable]
    )

    const state = useDateRangePickerState({
      defaultOpen,
      defaultValue,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      isOpen,
      maxValue,
      minValue,
      onChange,
      onOpenChange,
      value
    })

    const groupRef = useRef<HTMLDivElement>(null)
    const forkedGroupRef = useForkedRef(ref, groupRef)
    const calendarRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const toggleButtonRef = useRef<HTMLButtonElement>(null)

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

    const { overlayStyle, placementAttr, overlayDismissProps } = useOverlayPlacement({
      overlayRef,
      state,
      triggerRef: groupRef
    })

    const { dialogProps: domDialogProps } = useDialog(dialogProps, calendarRef)

    return renderFormField({
      children: (
        <>
          {renderDatePickerShell({
            calendar: (
              <RangeCalendar
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
            ),
            className,
            // `state.value` is always a `{ start, end }` object, never `null` itself — even with
            // nothing picked yet — so the endpoints are what actually indicate a selection to
            // clear (matching the hidden-input `value`s below, which check the same way).
            clearButton: (state.value?.start || state.value?.end) && !disabled && (
              <ClearButton
                onPress={() => {
                  state.setValue(null)
                  // See `DatePicker`'s identical `ClearButton` usage for why this is needed —
                  // this button unmounts itself once cleared, so focus needs somewhere to land.
                  toggleButtonRef.current?.focus()
                }}
              />
            ),
            disabled,
            field: (
              <>
                <DateField fieldProps={startFieldProps} />
                <span aria-hidden="true" className="daterangepicker-separator">
                  –
                </span>
                <DateField fieldProps={endFieldProps} />
              </>
            ),
            fieldClassName: 'd-flex w-100',
            groupProps: {
              ...mergeProps(groupProps, rest),
              'aria-describedby': describedBy,
              'aria-labelledby': labelledBy
            },
            groupRef: forkedGroupRef,
            invalid,
            isOpen: state.isOpen,
            overlayDismissProps,
            overlayRef,
            overlayStyle,
            placementAttr,
            size,
            toggleButton: (
              <CalendarToggleButton buttonProps={buttonProps} ref={toggleButtonRef} state={state} />
            ),
            valid
          })}
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
)

DateRangePicker.displayName = 'DateRangePicker'
