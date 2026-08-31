import React, { forwardRef, HTMLAttributes, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { AriaCalendarProps, mergeProps, useCalendar, useCalendarCell, useLocale } from 'react-aria'
import { CalendarState as StatelyCalendarState, DateValue, useCalendarState } from 'react-stately'
import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  isToday,
  isWeekend,
  today
} from '@internationalized/date'

import { useForkedRef } from '../../hooks'
import { CalendarMonthBlock } from './CalendarMonthBlock'
import { CalendarMonthYearPicker } from './CalendarMonthYearPicker'
import { CalendarNavButton } from './CalendarNavButton'
import { CalendarWeekGrid } from './CalendarWeekGrid'
import { mergeIsDateUnavailable } from '../../utils/mergeIsDateUnavailable'
import './Calendar.scss'

interface CalendarBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the calendar, used when there's no visible label. Required for
   * standalone use — a calendar grid has no other accessible name of its own.
   */
  'aria-label'?: string
  /**
   * Identifies a visible label element for the calendar.
   */
  'aria-labelledby'?: string
  /**
   * Whether to automatically focus the calendar when it mounts.
   */
  autoFocus?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Prevents the calendar from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * The day that starts the week, overriding the default set by the active locale.
   *
   * @default 'mon'
   */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
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
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   */
  unavailableDates?: string[]
  /**
   * Number of months to display side by side, sharing one selection. Wraps to multiple rows in
   * a narrow container (e.g. a popover on a small screen) rather than overflowing — the wrap is
   * driven by the calendar's own width, not the viewport, so it adapts correctly regardless of
   * where the calendar is embedded.
   *
   * @default 1
   */
  visibleMonths?: number
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /**
   * The initial selected date (uncontrolled).
   */
  defaultValue?: DateValue | null
  /**
   * Callback fired when the selected date changes. Unlike `DatePicker`'s `onChange` (whose
   * segmented field can be cleared to `null`), a calendar selection is always a concrete date.
   */
  onChange?: (value: DateValue) => void
  /**
   * Whether a single date or multiple, independently toggled dates can be selected.
   *
   * @default 'single'
   */
  selectionMode?: 'single'
  /**
   * The selected date (controlled).
   */
  value?: DateValue | null
}

export interface CalendarMultipleProps extends CalendarBaseProps {
  /**
   * The initial selected dates (uncontrolled).
   */
  defaultValue?: DateValue[] | null
  /**
   * Callback fired when the set of selected dates changes.
   */
  onChange?: (value: DateValue[]) => void
  /**
   * Whether a single date or multiple, independently toggled dates can be selected.
   *
   * @default 'single'
   */
  selectionMode: 'multiple'
  /**
   * The selected dates (controlled).
   */
  value?: DateValue[] | null
}

export type CalendarProps = CalendarSingleProps | CalendarMultipleProps

// Public, standalone calendar grid — also used internally by `DatePicker` to render the grid
// inside its popover. Deliberately has no knowledge of dialog/popover semantics (role="dialog",
// focus trapping, etc.) — that's the caller's concern, layered on via the `...rest` passthrough
// below (see `DatePicker`, which merges its own `useDialog` output in this way).
//
// `selectionMode` is a discriminated union on the public props (single vs. multiple value/
// onChange shapes), bridged onto one underlying `useCalendarState`/`useCalendar` call instantiated
// over the union of both modes — react-stately/react-aria are natively selection-mode-aware at
// that layer (including `useCalendarCell`'s `isSelected`), so no custom multi-select logic is
// needed here, just narrow, provably-safe casts at the seam between the public union and the
// single generic call (react-stately always reports/expects the value shape matching whichever
// `selectionMode` was actually passed in).
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, forwardedRef) => {
  const {
    autoFocus,
    className,
    defaultValue,
    disabled,
    firstDayOfWeek = 'mon',
    isDateUnavailable,
    maxValue,
    minValue,
    onChange,
    selectionMode = 'single',
    unavailableDates,
    value,
    visibleMonths = 1,
    ...rest
  } = props

  const { locale } = useLocale()
  const internalRef = useRef<HTMLDivElement>(null)
  const ref = useForkedRef(internalRef, forwardedRef)
  const combinedIsDateUnavailable = useMemo(
    () => mergeIsDateUnavailable(unavailableDates, isDateUnavailable),
    [unavailableDates, isDateUnavailable]
  )
  // Tracks each visible month block's own view, keyed by `monthIndex` — same reasoning as
  // `RangeCalendar`'s identical state: needed only to know whether *any* block has switched
  // away from the day grid, so the global `.datepicker-controls` overlay can hide itself rather
  // than sit on top of `CalendarYearGrid`'s own pager.
  const [monthViews, setMonthViews] = useState<Record<number, 'days' | 'months' | 'years'>>({})
  const hasPickerView = Object.values(monthViews).some((view) => view !== 'days')

  const handleChange = (next: DateValue | readonly DateValue[]) => {
    if (selectionMode === 'multiple') {
      ;(onChange as ((value: DateValue[]) => void) | undefined)?.(next as DateValue[])
    } else {
      ;(onChange as ((value: DateValue) => void) | undefined)?.(next as DateValue)
    }
  }
  const normalizedValue = value as DateValue | readonly DateValue[] | null | undefined
  const normalizedDefaultValue = defaultValue as DateValue | readonly DateValue[] | null | undefined
  // react-stately's `useCalendarState` crashes computing the initial focused date for
  // `selectionMode: 'multiple'` when the (controlled or default) value is a genuinely empty
  // array — its own fallback-to-today logic only runs when the value is nullish, but an empty
  // array is truthy, so it instead indexes the (nonexistent) first element and calls `.subtract`
  // on the resulting `undefined`. Supplying `defaultFocusedValue` ourselves in exactly that case
  // short-circuits react-stately's logic before it ever reaches the buggy branch, without
  // affecting the normal "focus follows the selection" behavior whenever there is one.
  const resolvedValue = normalizedValue !== undefined ? normalizedValue : normalizedDefaultValue
  const defaultFocusedValue =
    selectionMode === 'multiple' && Array.isArray(resolvedValue) && resolvedValue.length === 0
      ? today(getLocalTimeZone())
      : undefined

  const state = useCalendarState<DateValue, 'single' | 'multiple'>({
    autoFocus,
    createCalendar,
    defaultFocusedValue,
    defaultValue: normalizedDefaultValue,
    firstDayOfWeek,
    isDateUnavailable: combinedIsDateUnavailable,
    isDisabled: disabled,
    locale,
    maxValue,
    minValue,
    onChange: handleChange,
    // Prev/next always slide the visible window by one month, regardless of `visibleMonths` —
    // same reasoning as `RangeCalendar`'s identical setting (see that component's own comment).
    pageBehavior: 'single',
    selectionMode,
    value: normalizedValue,
    visibleDuration: { months: visibleMonths }
  })

  const ariaProps: AriaCalendarProps<DateValue, 'single' | 'multiple'> = {
    'aria-label': rest['aria-label'],
    'aria-labelledby': rest['aria-labelledby'],
    autoFocus,
    defaultFocusedValue,
    defaultValue: normalizedDefaultValue,
    isDateUnavailable: combinedIsDateUnavailable,
    isDisabled: disabled,
    maxValue,
    minValue,
    onChange: handleChange,
    selectionMode,
    value: normalizedValue
  }

  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(ariaProps, state)
  const prevButton = <CalendarNavButton buttonProps={prevButtonProps} direction="prev" />
  const nextButton = <CalendarNavButton buttonProps={nextButtonProps} direction="next" />

  return (
    <div
      {...mergeProps(calendarProps, rest)}
      className={classNames('datepicker', className)}
      data-cx-inline="true"
      ref={ref}
    >
      {visibleMonths === 1 ? (
        <CalendarMonthYearPicker
          monthStart={state.visibleRange.start}
          nextArrow={nextButton}
          prevArrow={prevButton}
          state={state}
        >
          <CalendarWeekGrid
            firstDayOfWeek={firstDayOfWeek}
            renderCell={(date) => <CalendarCell date={date} locale={locale} state={state} />}
            state={state}
          />
        </CalendarMonthYearPicker>
      ) : (
        <>
          {/* `.datepicker[data-cx-inline]` (the root above) is already `position: relative` in
              chassis-css, so this overlay needs no extra positioning wrapper of its own — unlike
              `RangeCalendar`, which has a `presets` column sharing that root and so scopes its
              own copy of this overlay to a nested `.datepicker-body` instead. */}
          {!hasPickerView && (
            <div className="datepicker-controls">
              {prevButton}
              {nextButton}
            </div>
          )}
          <div className="datepicker-grid">
            {[...new Array(visibleMonths).keys()].map((monthIndex) => (
              <CalendarMonthBlock
                firstDayOfWeek={firstDayOfWeek}
                key={monthIndex}
                monthIndex={monthIndex}
                onViewChange={(view) => setMonthViews((prev) => ({ ...prev, [monthIndex]: view }))}
                renderCell={(date) => <CalendarCell date={date} locale={locale} state={state} />}
                state={state}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
})

Calendar.displayName = 'Calendar'

type CalendarState = StatelyCalendarState<'single' | 'multiple'>

interface CalendarCellProps {
  date: CalendarDate
  locale: string
  state: CalendarState
}

const CalendarCell = ({ date, locale, state }: CalendarCellProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date }, state, ref)
  const isCurrentDate = isToday(date, getLocalTimeZone())

  return (
    <div
      {...cellProps}
      aria-current={isCurrentDate ? 'date' : undefined}
      className={classNames('datepicker-date', {
        'datepicker-date-selected': isSelected,
        'datepicker-date-today': isCurrentDate,
        'datepicker-date-outside': isOutsideVisibleRange,
        'datepicker-date-disabled': isDisabled,
        'datepicker-date-unavailable': isUnavailable,
        'datepicker-date-weekend': isWeekend(date, locale)
      })}
    >
      <button {...buttonProps} type="button" className="datepicker-date-btn" ref={ref}>
        {formattedDate}
      </button>
    </div>
  )
}
