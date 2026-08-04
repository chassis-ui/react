import React, { forwardRef, HTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import { AriaCalendarProps, mergeProps, useCalendar, useCalendarCell, useLocale } from 'react-aria'
import { CalendarState, DateValue, useCalendarState } from 'react-stately'
import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  isToday,
  isWeekend
} from '@internationalized/date'

import { useForkedRef } from '../../hooks'
import { CalendarMonthYearPicker } from './CalendarMonthYearPicker'
import { CalendarNavButton } from './CalendarNavButton'
import { CalendarWeekGrid } from './CalendarWeekGrid'
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
      firstDayOfWeek = 'mon',
      isDateUnavailable,
      maxValue,
      minValue,
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
      firstDayOfWeek,
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

    const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(ariaProps, state)

    return (
      <div
        {...mergeProps(calendarProps, rest)}
        className={classNames('datepicker', className)}
        data-cx-inline="true"
        ref={ref}
      >
        <CalendarMonthYearPicker
          monthStart={state.visibleRange.start}
          nextArrow={<CalendarNavButton buttonProps={nextButtonProps} direction="next" />}
          prevArrow={<CalendarNavButton buttonProps={prevButtonProps} direction="prev" />}
          state={state}
        >
          <CalendarWeekGrid
            firstDayOfWeek={firstDayOfWeek}
            renderCell={(date) => <CalendarCell date={date} locale={locale} state={state} />}
            state={state}
          />
        </CalendarMonthYearPicker>
      </div>
    )
  }
)

CxCalendar.displayName = 'CxCalendar'

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
        'datepicker-date-today': isToday(date, getLocalTimeZone()),
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
