import React, { forwardRef, HTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaCalendarProps,
  mergeProps,
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useCalendarMonthPicker,
  useCalendarYearPicker,
  useLocale
} from 'react-aria'
import { CalendarState, DateValue, useCalendarState } from 'react-stately'
import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  getWeeksInMonth,
  isToday,
  isWeekend
} from '@internationalized/date'

import { useForkedRef } from '../../hooks'
import { mergeIsDateUnavailable } from './mergeIsDateUnavailable'
import './CxCalendar.css'

export interface CxCalendarProps extends Omit<
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
   * The initial selected date (uncontrolled).
   */
  defaultValue?: DateValue | null
  /**
   * Prevents the calendar from being focused or interacted with.
   */
  disabled?: boolean
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
   * How to navigate between months. `'dropdown'` shows month and year `<select>`s next to the
   * prev/next buttons, for jumping further than one page at a time. `'arrows'` shows only the
   * prev/next buttons and a plain text title.
   *
   * @default 'dropdown'
   */
  navigation?: 'dropdown' | 'arrows'
  /**
   * Callback fired when the selected date changes. Unlike `CxDatePicker`'s `onChange` (whose
   * segmented field can be cleared to `null`), a calendar selection is always a concrete date.
   */
  onChange?: (value: DateValue) => void
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   */
  unavailableDates?: string[]
  /**
   * The selected date (controlled).
   */
  value?: DateValue | null
}

// Public, standalone calendar grid — also used internally by `CxDatePicker` to render the grid
// inside its popover. Deliberately has no knowledge of dialog/popover semantics (role="dialog",
// focus trapping, etc.) — that's the caller's concern, layered on via the `...rest` passthrough
// below (see `CxDatePicker`, which merges its own `useDialog` output in this way).
export const CxCalendar = forwardRef<HTMLDivElement, CxCalendarProps>(
  (
    {
      autoFocus,
      className,
      defaultValue,
      disabled,
      isDateUnavailable,
      maxValue,
      minValue,
      navigation = 'dropdown',
      onChange,
      unavailableDates,
      value,
      ...rest
    },
    forwardedRef
  ) => {
    const { locale } = useLocale()
    const internalRef = useRef<HTMLDivElement>(null)
    const ref = useForkedRef(internalRef, forwardedRef)
    const combinedIsDateUnavailable = mergeIsDateUnavailable(unavailableDates, isDateUnavailable)

    const state = useCalendarState({
      autoFocus,
      createCalendar,
      defaultValue,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      locale,
      maxValue,
      minValue,
      onChange,
      value,
      visibleDuration: { months: 1 }
    })

    const ariaProps: AriaCalendarProps<DateValue> = {
      'aria-label': rest['aria-label'],
      'aria-labelledby': rest['aria-labelledby'],
      autoFocus,
      defaultValue,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      maxValue,
      minValue,
      onChange,
      value
    }

    const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(ariaProps, state)
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const { buttonProps: domPrevButtonProps } = useButton(prevButtonProps, prevRef)
    const { buttonProps: domNextButtonProps } = useButton(nextButtonProps, nextRef)

    return (
      <div
        {...mergeProps(calendarProps, rest)}
        className={classNames('datepicker', className)}
        data-cx-inline="true"
        ref={ref}
      >
        <div className="datepicker-header">
          <button
            {...domPrevButtonProps}
            className="datepicker-arrow datepicker-arrow-prev"
            ref={prevRef}
            type="button"
          >
            ‹
          </button>
          {navigation === 'dropdown' ? (
            <CalendarNavDropdowns state={state} />
          ) : (
            <div className="datepicker-header-content">{title}</div>
          )}
          <button
            {...domNextButtonProps}
            className="datepicker-arrow datepicker-arrow-next"
            ref={nextRef}
            type="button"
          >
            ›
          </button>
        </div>
        <CalendarGrid locale={locale} state={state} />
      </div>
    )
  }
)

CxCalendar.displayName = 'CxCalendar'

interface CalendarNavDropdownsProps {
  state: CalendarState
}

// `useCalendarMonthPicker`/`useCalendarYearPicker` both drive navigation through
// `state.setFocusedDate` — the same primitive the prev/next buttons use — so switching months or
// years this way still updates `state.visibleRange` normally, which is what `useCalendar`'s own
// live-region effect (wired up in the parent) watches to announce the new visible range. No extra
// announcement plumbing needed here.
const CalendarNavDropdowns = ({ state }: CalendarNavDropdownsProps) => {
  const monthPicker = useCalendarMonthPicker({}, state)
  const yearPicker = useCalendarYearPicker({}, state)

  return (
    <div className="datepicker-header-content">
      <select
        aria-label={monthPicker['aria-label']}
        className="cx-calendar-select"
        disabled={state.isDisabled}
        onChange={(e) => monthPicker.onChange(Number(e.target.value))}
        value={monthPicker.value}
      >
        {monthPicker.items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.formatted}
          </option>
        ))}
      </select>
      <select
        aria-label={yearPicker['aria-label']}
        className="cx-calendar-select"
        disabled={state.isDisabled}
        onChange={(e) => yearPicker.onChange(Number(e.target.value))}
        value={yearPicker.value}
      >
        {yearPicker.items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.formatted}
          </option>
        ))}
      </select>
    </div>
  )
}

interface CalendarGridProps {
  locale: string
  state: CalendarState
}

const CalendarGrid = ({ locale, state }: CalendarGridProps) => {
  const { gridProps, headerProps, weekDays } = useCalendarGrid({}, state)
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <div className="datepicker-wrapper">
      <div {...gridProps} className="datepicker-content">
        <div {...headerProps} className="datepicker-week" role="row">
          {weekDays.map((day, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <span className="datepicker-week-day" key={index} role="columnheader">
              {day}
            </span>
          ))}
        </div>
        <div className="datepicker-dates">
          {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
            <div className="datepicker-dates-row" key={weekIndex} role="row">
              {state.getDatesInWeek(weekIndex).map((date, i) =>
                date ? (
                  <CalendarCell date={date} key={date.toString()} locale={locale} state={state} />
                ) : (
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="datepicker-date" key={i} role="gridcell" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface CalendarCellProps {
  date: CalendarDate
  locale: string
  state: CalendarState
}

const CalendarCell = ({ date, locale, state }: CalendarCellProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date }, state, ref)

  return (
    <div
      {...cellProps}
      aria-current={isToday(date, getLocalTimeZone()) ? 'date' : undefined}
      className={classNames('datepicker-date', {
        'datepicker-date-selected': isSelected,
        'datepicker-date-outside': isOutsideVisibleRange,
        'datepicker-date-disabled': isDisabled,
        'datepicker-date-unavailable': isUnavailable,
        'datepicker-date-weekend': isWeekend(date, locale)
      })}
    >
      <div {...buttonProps} className="datepicker-date-btn" ref={ref}>
        {formattedDate}
      </div>
    </div>
  )
}
