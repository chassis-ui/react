import React, { forwardRef, HTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaRangeCalendarProps,
  mergeProps,
  RangeValue,
  useButton,
  useCalendarCell,
  useCalendarGrid,
  useCalendarHeading,
  useCalendarMonthPicker,
  useCalendarYearPicker,
  useLocale,
  useRangeCalendar
} from 'react-aria'
import { DateValue, RangeCalendarState, useRangeCalendarState } from 'react-stately'
import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  isSameDay,
  isToday,
  isWeekend
} from '@internationalized/date'

import { useForkedRef } from '../../hooks'
import { mergeIsDateUnavailable } from './mergeIsDateUnavailable'
import './CxCalendar.css'
import './CxRangeCalendar.css'

export interface CxRangeCalendarProps extends Omit<
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
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null
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
   * Callback fired when a complete range is selected (both a start and end date).
   */
  onChange?: (value: RangeValue<DateValue>) => void
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   */
  unavailableDates?: string[]
  /**
   * The selected date range (controlled).
   */
  value?: RangeValue<DateValue> | null
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

// Range counterpart to `CxCalendar` — same dialog-agnostic composition boundary (see that
// component's own comment) and the same header/nav-dropdown/grid visual language, reusing
// `CxCalendar.css`'s shared classes directly. Kept as its own component rather than a `mode` prop
// on `CxCalendar`: the underlying react-stately/react-aria hooks are a genuinely different pair
// (`useRangeCalendarState`/`useRangeCalendar` vs `useCalendarState`/`useCalendar`), and the cell
// rendering has range-only concerns (start/end/in-between pill styling) with no single-date
// equivalent.
export const CxRangeCalendar = forwardRef<HTMLDivElement, CxRangeCalendarProps>(
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
      visibleMonths = 1,
      ...rest
    },
    forwardedRef
  ) => {
    const { locale } = useLocale()
    const internalRef = useRef<HTMLDivElement>(null)
    const ref = useForkedRef(internalRef, forwardedRef)
    const combinedIsDateUnavailable = mergeIsDateUnavailable(unavailableDates, isDateUnavailable)

    const state = useRangeCalendarState({
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
      visibleDuration: { months: visibleMonths }
    })

    const ariaProps: AriaRangeCalendarProps<DateValue> = {
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

    const { calendarProps, prevButtonProps, nextButtonProps, title } = useRangeCalendar(
      ariaProps,
      state,
      internalRef
    )
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
        <div className="cx-calendar-months">
          {[...new Array(visibleMonths).keys()].map((monthIndex) => (
            <CalendarMonth
              key={monthIndex}
              locale={locale}
              monthIndex={monthIndex}
              // A single month already has its own name in the header above (title or dropdowns)
              // — a second heading here would just repeat it.
              showHeading={visibleMonths > 1}
              state={state}
            />
          ))}
        </div>
      </div>
    )
  }
)

CxRangeCalendar.displayName = 'CxRangeCalendar'

interface CalendarNavDropdownsProps {
  state: RangeCalendarState
}

// Same primitives as `CxCalendar`'s dropdown nav — `useCalendarMonthPicker`/`useCalendarYearPicker`
// both accept a plain `CalendarState` or a `RangeCalendarState` interchangeably.
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

interface CalendarMonthProps {
  locale: string
  monthIndex: number
  showHeading: boolean
  state: RangeCalendarState
}

// One visible month within `visibleMonths` — `useCalendarGrid`'s `startDate`/`endDate` and
// `useCalendarHeading`'s `offset` are both designed for exactly this "multiple date grids in one
// calendar" case, so no manual date math is needed beyond locating this month's own start.
const CalendarMonth = ({ locale, monthIndex, showHeading, state }: CalendarMonthProps) => {
  const monthStart = state.visibleRange.start.add({ months: monthIndex })
  const heading = useCalendarHeading({ offset: { months: monthIndex } }, state)
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    { startDate: monthStart },
    state
  )

  return (
    <div className="cx-calendar-month">
      {showHeading && <div className="cx-calendar-month-heading">{heading}</div>}
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
            {[...new Array(weeksInMonth).keys()].map((weekIndex) => {
              const week = state.getDatesInWeek(weekIndex, monthStart)
              return (
                <div className="datepicker-dates-row" key={weekIndex} role="row">
                  {week.map((date, i) =>
                    date ? (
                      <CalendarCell
                        date={date}
                        isFirstInRow={i === 0}
                        isLastInRow={i === week.length - 1}
                        key={date.toString()}
                        locale={locale}
                        state={state}
                      />
                    ) : (
                      // eslint-disable-next-line react/no-array-index-key
                      <div className="datepicker-date" key={i} role="gridcell" />
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CalendarCellProps {
  date: CalendarDate
  isFirstInRow: boolean
  isLastInRow: boolean
  locale: string
  state: RangeCalendarState
}

const CalendarCell = ({ date, isFirstInRow, isLastInRow, locale, state }: CalendarCellProps) => {
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

  // `isSelected` is true for every day in the range, not just its endpoints — the pill's rounded
  // caps belong only at the true start/end (or wherever a row wraps mid-range, so the band still
  // reads as continuous week to week); everything else in between is a flush, square-edged band.
  const { highlightedRange } = state
  const isRangeStart = Boolean(highlightedRange && isSameDay(date, highlightedRange.start))
  const isRangeEnd = Boolean(highlightedRange && isSameDay(date, highlightedRange.end))

  return (
    <div
      {...cellProps}
      aria-current={isToday(date, getLocalTimeZone()) ? 'date' : undefined}
      className={classNames('datepicker-date', {
        'datepicker-date-in-range': isSelected,
        'datepicker-date-range-start': isSelected && (isRangeStart || isFirstInRow),
        'datepicker-date-range-end': isSelected && (isRangeEnd || isLastInRow),
        'datepicker-date-outside': isOutsideVisibleRange,
        'datepicker-date-disabled': isDisabled,
        'datepicker-date-unavailable': isUnavailable,
        'datepicker-date-weekend': isWeekend(date, locale)
      })}
    >
      <div
        {...buttonProps}
        className={classNames('datepicker-date-btn', {
          'datepicker-date-range-start': isRangeStart,
          'datepicker-date-range-end': isRangeEnd
        })}
        ref={ref}
      >
        {formattedDate}
      </div>
    </div>
  )
}
