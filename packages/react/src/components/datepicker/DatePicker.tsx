import React, { forwardRef, HTMLAttributes, ReactNode, useMemo, useRef, useState } from 'react'
import { AriaButtonProps, mergeProps, useDateFormatter, useDatePicker, useDialog } from 'react-aria'
import {
  DateValue,
  OverlayTriggerState,
  useDatePickerState,
  useOverlayTriggerState
} from 'react-stately'
import { getLocalTimeZone } from '@internationalized/date'

import { useForkedRef, useFormField, useOpenStateProps, useOverlayPlacement } from '../../hooks'
import { mergeIsDateUnavailable } from '../../utils/mergeIsDateUnavailable'
import { withoutSlotIds } from '../../utils/idRefs'
import { renderFormField } from '../form-field/renderFormField'
import { Calendar } from '../calendar/Calendar'
import { CalendarToggleButton } from './CalendarToggleButton'
import { ClearButton } from './ClearButton'
import { DateField } from './DateField'
import { renderDatePickerShell } from './renderDatePickerShell'
import './DatePicker.scss'
import { CalendarLabels, CalendarLabelsProvider, DEFAULT_CALENDAR_LABELS } from '../calendar/labels'

interface DatePickerBaseProps extends Omit<
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
   * Whether the calendar popover is open by default (uncontrolled).
   *
   * @deprecated Use `defaultVisible`.
   */
  defaultOpen?: boolean
  /**
   * Whether the calendar popover is open when the date picker first renders. Use it instead of
   * `visible` when nothing outside needs to control the popover.
   *
   * @default false
   */
  defaultVisible?: boolean
  /**
   * Prevents the date picker from being focused or interacted with.
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
   * Overrides for the strings this component and its calendar render themselves rather than
   * getting from the active locale — the calendar trigger, the clear adornment, and the calendar's
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
   * `name` of an auto-created hidden input, kept in sync with the selection, for native form
   * submission — one input when `selectionMode` is `'single'`, one per selected date when it's
   * `'multiple'` (same `name` on each, which browsers serialize as multiple form values). Omit to
   * skip creating any. The value is the date's `toString()`: `2026-03-15`, with a time
   * `2026-03-15T09:30:00`, and with a time zone `2026-03-15T09:30:00+09:00[Asia/Tokyo]`, which
   * `parseZonedDateTime` reads back.
   */
  name?: string
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
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   * Applies to both the calendar overlay and typing a date directly into the field.
   */
  unavailableDates?: string[]
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the date picker when `valid` is set.
   */
  validFeedback?: ReactNode
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

export interface DatePickerSingleProps extends DatePickerBaseProps {
  /**
   * The initial selected date (uncontrolled).
   */
  defaultValue?: DateValue | null
  /**
   * The smallest unit the field shows and edits. `'hour'`, `'minute'` and `'second'` add a time
   * to the date: the value is then a `CalendarDateTime`, or a `ZonedDateTime` when `value`,
   * `defaultValue` or `placeholderValue` is one, and a value or placeholder given must carry a
   * time. Picking a day in the calendar keeps the time. A day picked in an empty field takes the
   * time, and zone, of `defaultValue`, else `placeholderValue`, else midnight with no zone: a
   * controlled zoned `value`, once cleared, needs a zoned `placeholderValue` to stay zoned.
   *
   * @default 'day', or 'minute' for a value with a time
   */
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  /**
   * Hide the time zone of a `ZonedDateTime` value.
   */
  hideTimeZone?: boolean
  /**
   * Show 12 or 24 hours. Defaults to the locale's.
   */
  hourCycle?: 12 | 24
  /**
   * The date the segments start from while the field is empty, such as
   * `new CalendarDateTime(2026, 1, 1, 9)`, and the month the calendar opens on. With no
   * `defaultValue`, its time is the one a day picked in the calendar gets, and its type the type
   * of value `onChange` receives: a `ZonedDateTime` gives zoned values. With a time
   * `granularity` it must carry a time.
   */
  placeholderValue?: DateValue
  /**
   * Show a leading zero on the day, month and hour, as `03/05` rather than `3/5`, whatever the
   * locale does.
   */
  shouldForceLeadingZeros?: boolean
  /**
   * Callback fired when the selected date changes. With a time (`granularity`), it receives a
   * `CalendarDateTime` or `ZonedDateTime`.
   */
  onChange?: (value: DateValue | null) => void
  /**
   * Whether a single date or multiple, independently toggled dates can be selected. Multiple
   * selection replaces the editable segmented field with a read-only, comma-separated list of
   * the selected dates — a segmented day/month/year field has no way to represent more than one
   * date.
   *
   * @default 'single'
   */
  selectionMode?: 'single'
  /**
   * The selected date (controlled).
   */
  value?: DateValue | null
}

export interface DatePickerMultipleProps extends DatePickerBaseProps {
  /**
   * The initial selected dates (uncontrolled).
   */
  defaultValue?: DateValue[] | null
  /**
   * Callback fired when the set of selected dates changes.
   */
  onChange?: (value: DateValue[]) => void
  /**
   * Whether a single date or multiple, independently toggled dates can be selected. Multiple
   * selection replaces the editable segmented field with a read-only, comma-separated list of
   * the selected dates — a segmented day/month/year field has no way to represent more than one
   * date.
   *
   * @default 'single'
   */
  selectionMode: 'multiple'
  /**
   * The selected dates (controlled).
   */
  value?: DateValue[] | null
}

export type DatePickerProps = DatePickerSingleProps | DatePickerMultipleProps

// Dispatches on `selectionMode` between two internal implementations that share little beyond
// the field/overlay shell and `useFormField` — `selectionMode: 'multiple'` has no
// `useDatePickerState`/`useDatePicker` equivalent to build on (see `DatePickerMultiple`'s own
// comment), so bolting an array value onto the single-value hook pair isn't an option.
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  if (props.selectionMode === 'multiple') return <DatePickerMultiple {...props} ref={ref} />
  return <DatePickerSingle {...props} ref={ref} />
})

DatePicker.displayName = 'DatePicker'

const DatePickerSingle = forwardRef<HTMLDivElement, DatePickerSingleProps>(
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
      selectionMode: _selectionMode,
      shouldForceLeadingZeros,
      size,
      unavailableDates,
      valid,
      validFeedback,
      value,
      visible,
      visibleMonths,
      ...rest
    }: DatePickerSingleProps,
    ref
  ) => {
    const combinedIsDateUnavailable = useMemo(
      () => mergeIsDateUnavailable(unavailableDates, isDateUnavailable),
      [unavailableDates, isDateUnavailable]
    )

    // What both react-stately's state and react-aria's hook read: the hook hands the time props
    // on to the field's segments.
    const pickerProps = {
      defaultValue,
      granularity,
      hideTimeZone,
      hourCycle,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      // `false` would override the state's own check of the range and unavailable dates:
      // react-stately takes a defined `isInvalid` as the whole validation state.
      isInvalid: invalid || undefined,
      maxValue,
      minValue,
      onChange,
      placeholderValue,
      shouldForceLeadingZeros,
      value
    }

    const state = useDatePickerState({
      ...useOpenStateProps(
        { defaultOpen, defaultVisible, isOpen, onOpenChange, onVisibleChange, visible },
        'DatePicker'
      ),
      ...pickerProps
    })
    // A value outside `minValue`/`maxValue`, or on an unavailable date, is invalid too, shown as
    // `invalid` is, as `TimeField` shows it.
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
      errorMessageProps,
      fieldProps,
      groupProps
    } = useDatePicker(
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

    // `Calendar` is dialog-agnostic by design (see its own comment) — applying `role="dialog"`
    // etc. is this component's concern, layered on via the generic HTML-attribute passthrough
    // `Calendar` merges onto its root.
    const { dialogProps: domDialogProps } = useDialog(dialogProps, calendarRef)

    return (
      <CalendarLabelsProvider labels={labels}>
        {renderFormField({
          children: (
            <>
              {renderDatePickerShell({
                calendar: (
                  <Calendar
                    {...domDialogProps}
                    autoFocus
                    defaultFocusedValue={calendarProps.defaultFocusedValue}
                    disabled={disabled}
                    firstDayOfWeek={firstDayOfWeek}
                    isDateUnavailable={combinedIsDateUnavailable}
                    maxValue={maxValue}
                    minValue={minValue}
                    onChange={calendarProps.onChange}
                    ref={calendarRef}
                    value={calendarProps.value}
                    visibleMonths={visibleMonths}
                  />
                ),
                className,
                clearButton: state.value && !disabled && (
                  <ClearButton
                    onPress={() => {
                      state.setValue(null)
                      // `ClearButton` unmounts itself once `state.value` clears — without this, focus
                      // would otherwise drop to `document.body` (same failure mode fixed for the
                      // calendar's own month/year view switch — see `CalendarMonthYearPicker`'s comment).
                      toggleButtonRef.current?.focus()
                    }}
                  />
                ),
                disabled,
                field: (
                  <DateField
                    fieldProps={withoutSlotIds(fieldProps, descriptionProps, errorMessageProps)}
                  />
                ),
                fieldClassName: 'w-100 overflow-x-scroll',
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
                    buttonProps={withoutSlotIds(buttonProps, descriptionProps, errorMessageProps)}
                    ref={toggleButtonRef}
                    state={state}
                  />
                ),
                valid: showValid
              })}
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

DatePickerSingle.displayName = 'DatePickerSingle'

// `selectionMode: 'multiple'` counterpart to `DatePickerSingle` — deliberately not built on
// `useDatePickerState`/`useDatePicker`, since neither has any multi-value concept (a single
// `DateValue`, edited through one segmented day/month/year field that has no way to represent
// more than one date — see react-stately's own `useDatePickerState` types). Instead this is
// assembled from the same lower-level pieces already used elsewhere in this codebase:
// `useOverlayTriggerState` for open/close (the same `OverlayTriggerState` shape
// `useOverlayPlacement`/`CalendarToggleButton` already expect, so both are reused unchanged), the
// manual controlled/uncontrolled pattern `ChipInput` already uses for its own array value, and
// a read-only comma-separated field in place of `DateField`'s editable segments.
const DatePickerMultiple = forwardRef<HTMLDivElement, DatePickerMultipleProps>(
  (
    {
      className,
      defaultOpen,
      defaultValue,
      defaultVisible,
      disabled,
      firstDayOfWeek,
      help,
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
      selectionMode: _selectionMode,
      size,
      unavailableDates,
      valid,
      validFeedback,
      value,
      visible,
      visibleMonths,
      ...rest
    }: DatePickerMultipleProps,
    ref
  ) => {
    const combinedIsDateUnavailable = useMemo(
      () => mergeIsDateUnavailable(unavailableDates, isDateUnavailable),
      [unavailableDates, isDateUnavailable]
    )

    const isControlled = value !== undefined
    const [uncontrolledValues, setUncontrolledValues] = useState<DateValue[]>(defaultValue ?? [])
    const values = isControlled ? (value ?? []) : uncontrolledValues

    const setValues = (next: DateValue[]) => {
      if (!isControlled) setUncontrolledValues(next)
      onChange?.(next)
    }

    const state: OverlayTriggerState = useOverlayTriggerState(
      useOpenStateProps(
        { defaultOpen, defaultVisible, isOpen, onOpenChange, onVisibleChange, visible },
        'DatePicker'
      )
    )

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

    const { overlayStyle, placementAttr, overlayDismissProps } = useOverlayPlacement({
      overlayRef,
      state,
      triggerRef: groupRef
    })

    const { dialogProps: domDialogProps } = useDialog(
      { 'aria-label': rest['aria-label'], 'aria-labelledby': labelledBy },
      calendarRef
    )

    // This variant builds its own trigger button props rather than getting them from
    // `useDatePicker` (see the component comment), so it has to resolve the label itself — it's
    // the provider here, so it can't read the context it's about to publish.
    const mergedLabels = { ...DEFAULT_CALENDAR_LABELS, ...labels }

    const buttonProps: AriaButtonProps = {
      'aria-expanded': state.isOpen,
      'aria-haspopup': 'dialog',
      'aria-label': mergedLabels.calendar,
      isDisabled: disabled
    }

    return (
      <CalendarLabelsProvider labels={labels}>
        {renderFormField({
          children: (
            <>
              {renderDatePickerShell({
                calendar: (
                  <Calendar
                    {...domDialogProps}
                    autoFocus
                    disabled={disabled}
                    firstDayOfWeek={firstDayOfWeek}
                    isDateUnavailable={combinedIsDateUnavailable}
                    maxValue={maxValue}
                    minValue={minValue}
                    onChange={setValues}
                    ref={calendarRef}
                    selectionMode="multiple"
                    value={values}
                    visibleMonths={visibleMonths}
                  />
                ),
                className,
                clearButton: values.length > 0 && !disabled && (
                  <ClearButton
                    onPress={() => {
                      setValues([])
                      // See the single-selection `ClearButton` usage above for why this is needed.
                      toggleButtonRef.current?.focus()
                    }}
                  />
                ),
                disabled,
                field: <MultiDateField values={values} />,
                fieldClassName: 'w-100 overflow-x-scroll',
                groupProps: {
                  ...mergeProps(rest),
                  'aria-describedby': describedBy,
                  'aria-disabled': disabled || undefined,
                  'aria-labelledby': labelledBy,
                  id: groupId,
                  role: 'group'
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
                  <CalendarToggleButton
                    buttonProps={buttonProps}
                    ref={toggleButtonRef}
                    state={state}
                  />
                ),
                valid
              })}
              {name &&
                values.map((date) => (
                  <input
                    disabled={disabled}
                    key={date.toString()}
                    name={name}
                    type="hidden"
                    value={date.toString()}
                  />
                ))}
            </>
          ),
          help,
          ids: { feedback: feedbackId, help: helpId, label: labelId },
          invalid,
          invalidFeedback,
          label,
          valid,
          validFeedback
        })}
      </CalendarLabelsProvider>
    )
  }
)

DatePickerMultiple.displayName = 'DatePickerMultiple'

interface MultiDateFieldProps {
  values: DateValue[]
}

// `ZonedDateTime` carries its own time zone (`toDate()` takes no argument); `CalendarDate`/
// `CalendarDateTime` don't, so they need the viewer's local one supplied explicitly.
const toJsDate = (date: DateValue): Date =>
  'timeZone' in date ? date.toDate() : date.toDate(getLocalTimeZone())

// Read-only stand-in for `DateField`'s editable segments — a segmented day/month/year field can
// only ever represent one date, so multiple selection instead shows every selected date, formatted
// per the active locale and joined with commas.
const MultiDateField = ({ values }: MultiDateFieldProps) => {
  const formatter = useDateFormatter({ dateStyle: 'medium' })

  return (
    <div className="datepicker-field">
      {values.length > 0 && (
        <>
          {values
            .slice()
            .sort((a, b) => a.compare(b))
            .map((date) => formatter.format(toJsDate(date)))
            .join(', ')}
        </>
      )}
    </div>
  )
}
