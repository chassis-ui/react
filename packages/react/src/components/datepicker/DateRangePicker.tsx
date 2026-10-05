import React, { forwardRef, HTMLAttributes, ReactNode, useMemo, useRef } from 'react'
import { mergeProps, RangeValue, useDateRangePicker, useDialog } from 'react-aria'
import { DateValue, useDateRangePickerState } from 'react-stately'

import { useForkedRef, useFormField, useOpenStateProps, useOverlayPlacement } from '../../hooks'
import { DateRangePreset } from '../../utils/dateRangePresets'
import { mergeIsDateUnavailable } from '../../utils/mergeIsDateUnavailable'
import { withoutSlotIds } from '../../utils/idRefs'
import { renderFormField } from '../form-field/renderFormField'
import { RangeCalendar } from '../calendar/RangeCalendar'
import { CalendarToggleButton } from './CalendarToggleButton'
import { ClearButton } from './ClearButton'
import { DateField } from './DateField'
import { renderDatePickerShell } from './renderDatePickerShell'
import './DatePicker.scss'
import './DateRangePicker.scss'
import { CalendarLabels, CalendarLabelsProvider } from '../calendar/labels'

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
   * @deprecated Use `defaultVisible`.
   */
  defaultOpen?: boolean
  /**
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null
  /**
   * Whether the calendar popover is open when the date range picker first renders. Use it
   * instead of `visible` when nothing outside needs to control the popover.
   *
   * @default false
   */
  defaultVisible?: boolean
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
   * The smallest unit the fields show and edit. `'hour'`, `'minute'` and `'second'` add a time
   * to both dates: the range's dates are then `CalendarDateTime`s, or `ZonedDateTime`s when
   * `value`, `defaultValue` or `placeholderValue` holds them, and a range or placeholder given
   * must carry times. Picking a range in the calendar keeps the times. A range picked in an
   * empty field takes the time, and zone, of `placeholderValue`, else midnight with no zone: a
   * zoned range, once cleared, needs a zoned `placeholderValue` to stay zoned.
   *
   * @default 'day', or 'minute' for a range with times
   */
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  /**
   * A description for the field, rendered below the date range picker.
   */
  help?: ReactNode
  /**
   * Hide the time zone of `ZonedDateTime` dates.
   */
  hideTimeZone?: boolean
  /**
   * Show 12 or 24 hours. Defaults to the locale's.
   */
  hourCycle?: 12 | 24
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
   * Overrides for the strings this component and its calendar render themselves rather than
   * getting from the active locale — the calendar trigger, the clear adornment and the calendar's
   * own year-view arrows/announcements. Date segment order, month and weekday names all follow
   * `I18nProvider`'s locale via react-aria and need no override. Merged over the English defaults,
   * so passing one key leaves the rest alone.
   */
  labels?: Partial<CalendarLabels>
  /**
   * Whether the calendar popover is open (controlled).
   *
   * @deprecated Use `visible`.
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
   * them. Each value is the date's `toString()`: `2026-03-15`, with a time `2026-03-15T09:30:00`,
   * and with a time zone `2026-03-15T09:30:00+09:00[Asia/Tokyo]`, which `parseZonedDateTime`
   * reads back.
   */
  name?: string
  /**
   * Callback fired when the selected date range changes. With a time (`granularity`), its dates
   * are `CalendarDateTime`s or `ZonedDateTime`s.
   */
  onChange?: (value: RangeValue<DateValue> | null) => void
  /**
   * Callback fired when the calendar popover's open state changes.
   *
   * @deprecated Use `onVisibleChange`.
   */
  onOpenChange?: (isOpen: boolean) => void
  /**
   * Callback fired when the calendar popover asks to open or close: the calendar button, a
   * completed selection, the Escape key or a click outside. Receives the state it asks for.
   * With `visible` set, the popover changes only when `visible` does.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * The date both fields start from while empty, such as `new CalendarDateTime(2026, 1, 1, 9)`,
   * and the month the calendar opens on. Its time is the one a range picked in the calendar gets,
   * and its type the type of the dates `onChange` receives: a `ZonedDateTime` gives zoned dates.
   * With a time `granularity` it must carry a time.
   */
  placeholderValue?: DateValue
  /**
   * A list of quick-select range presets shown in the overlay next to the calendar. Selecting a
   * preset commits its range immediately, the same as picking a start and end date from the
   * calendar. The preset matching the current selection (if any) is marked selected. Omit to not
   * show a preset list.
   */
  presets?: DateRangePreset[]
  /**
   * Show a leading zero on the day, month and hour, as `03/05` rather than `3/5`, whatever the
   * locale does.
   */
  shouldForceLeadingZeros?: boolean
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
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
   * Whether the calendar popover is open. Setting it makes the popover controlled: it opens and
   * closes only when this changes, so pair it with `onVisibleChange`.
   */
  visible?: boolean
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
      defaultVisible,
      disabled,
      firstDayOfWeek,
      granularity,
      help,
      hideTimeZone,
      hourCycle,
      id,
      invalid,
      invalidFeedback,
      isDateUnavailable,
      isOpen,
      label,
      labels,
      maxValue,
      minValue,
      name,
      onChange,
      onOpenChange,
      onVisibleChange,
      placeholderValue,
      presets,
      shouldForceLeadingZeros,
      size,
      unavailableDates,
      valid,
      validFeedback,
      value,
      visible,
      visibleMonths,
      ...rest
    }: DateRangePickerProps,
    ref
  ): ReactNode => {
    const combinedIsDateUnavailable = useMemo(
      () => mergeIsDateUnavailable(unavailableDates, isDateUnavailable),
      [unavailableDates, isDateUnavailable]
    )

    // What both react-stately's state and react-aria's hook read: the hook hands the time props
    // on to the fields' segments.
    const pickerProps = {
      defaultValue,
      granularity,
      hideTimeZone,
      hourCycle,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      // `false` would override the state's own check of the range, unavailable dates and an end
      // before the start: react-stately takes a defined `isInvalid` as the whole validation state.
      isInvalid: invalid || undefined,
      maxValue,
      minValue,
      onChange,
      placeholderValue,
      shouldForceLeadingZeros,
      value
    }

    const state = useDateRangePickerState({
      ...useOpenStateProps(
        { defaultOpen, defaultVisible, isOpen, onOpenChange, onVisibleChange, visible },
        'DateRangePicker'
      ),
      ...pickerProps
    })
    // A range outside `minValue`/`maxValue`, over an unavailable date or ending before it starts
    // is invalid too, shown as `invalid` is, as `TimeField` shows a time out of range.
    const showInvalid = invalid || state.displayValidation.isInvalid
    const showValid = valid && !showInvalid

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
      invalid: showInvalid,
      invalidFeedback,
      label,
      valid: showValid,
      validFeedback
    })

    const {
      buttonProps,
      calendarProps,
      descriptionProps,
      dialogProps,
      endFieldProps,
      errorMessageProps,
      groupProps,
      startFieldProps
    } = useDateRangePicker(
      {
        ...pickerProps,
        'aria-label': rest['aria-label'],
        'aria-labelledby': labelledBy,
        id: groupId
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

    // react-aria names the trigger in the active locale; `labels.calendar` replaces that name.
    const triggerProps = labels?.calendar
      ? { ...buttonProps, 'aria-label': labels.calendar }
      : buttonProps

    return (
      <CalendarLabelsProvider labels={labels}>
        {renderFormField({
          children: (
            <>
              {renderDatePickerShell({
                calendar: (
                  <RangeCalendar
                    {...domDialogProps}
                    autoFocus
                    defaultFocusedValue={calendarProps.defaultFocusedValue}
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
                    <DateField
                      fieldProps={withoutSlotIds(
                        startFieldProps,
                        descriptionProps,
                        errorMessageProps
                      )}
                    />
                    <span aria-hidden="true" className="daterangepicker-separator">
                      –
                    </span>
                    <DateField
                      fieldProps={withoutSlotIds(
                        endFieldProps,
                        descriptionProps,
                        errorMessageProps
                      )}
                    />
                  </>
                ),
                fieldClassName: 'd-flex w-100',
                groupProps: {
                  ...mergeProps(groupProps, rest),
                  'aria-describedby': describedBy,
                  'aria-labelledby': labelledBy
                },
                groupRef: forkedGroupRef,
                invalid: showInvalid,
                isOpen: state.isOpen,
                overlayDismissProps,
                overlayRef,
                overlayStyle,
                placementAttr,
                size,
                toggleButton: (
                  <CalendarToggleButton
                    buttonProps={withoutSlotIds(triggerProps, descriptionProps, errorMessageProps)}
                    ref={toggleButtonRef}
                    state={state}
                  />
                ),
                valid: showValid
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
          invalid: showInvalid,
          invalidFeedback,
          label,
          valid: showValid,
          validFeedback
        })}
      </CalendarLabelsProvider>
    )
  }
)

DateRangePicker.displayName = 'DateRangePicker'
