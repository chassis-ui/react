import React, { forwardRef, HTMLAttributes, ReactNode, useMemo, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaRangeCalendarProps,
  mergeProps,
  RangeValue,
  useButton,
  useCalendarCell,
  useCalendarGrid,
  useDateFormatter,
  useLocale,
  useRangeCalendar
} from 'react-aria'
import { DateValue, RangeCalendarState, useRangeCalendarState } from 'react-stately'
import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  isSameDay,
  isSameYear,
  isToday,
  isWeekend,
  toCalendarDate
} from '@internationalized/date'

import { useForkedRef } from '../../hooks'
import { CxDateRangePreset } from './dateRangePresets'
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
   * Callback fired when a complete range is selected (both a start and end date).
   */
  onChange?: (value: RangeValue<DateValue>) => void
  /**
   * A list of quick-select range presets shown beside the calendar. Selecting a preset commits
   * its range immediately, the same as picking a start and end date from the grid. The preset
   * matching the current selection (if any) is marked selected. Omit to not show a preset list.
   */
  presets?: CxDateRangePreset[]
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
// equivalent. Unlike `CxCalendar`, navigation is always month/year dropdowns — a range picker is
// usually paired with `visibleMonths > 1`, where jumping several months/years at once is the
// common case, so there's no plain-arrows-only variant to choose between.
export const CxRangeCalendar = forwardRef<HTMLDivElement, CxRangeCalendarProps>(
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
      presets,
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
    const resolvedPresets = presets && presets.length > 0 ? presets : null

    const state = useRangeCalendarState({
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

    const { calendarProps, prevButtonProps, nextButtonProps } = useRangeCalendar(
      ariaProps,
      state,
      internalRef
    )
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const { buttonProps: domPrevButtonProps } = useButton(prevButtonProps, prevRef)
    const { buttonProps: domNextButtonProps } = useButton(nextButtonProps, nextRef)

    // A single pair of buttons, placed in exactly one spot depending on `visibleMonths` — inline
    // in the (only) month's own header for a single month, or once as a global overlay for
    // several — never both, so there's no risk of two DOM nodes fighting over one ref.
    const prevButton = (
      <button
        {...domPrevButtonProps}
        className="datepicker-arrow datepicker-arrow-prev"
        ref={prevRef}
        type="button"
      >
        ‹
      </button>
    )
    const nextButton = (
      <button
        {...domNextButtonProps}
        className="datepicker-arrow datepicker-arrow-next"
        ref={nextRef}
        type="button"
      >
        ›
      </button>
    )
    const singleMonthArrows = visibleMonths === 1 ? { next: nextButton, prev: prevButton } : null

    // Goes through the same `state.setValue` path a two-click grid selection does (rather than
    // calling `onChange` directly), so it behaves identically whether `value` is controlled or
    // uncontrolled — including `CxDateRangePicker`, which relies on this to auto-close its popover
    // the same way completing a range in the grid already does.
    const handlePresetSelect = (range: RangeValue<DateValue>) => {
      state.setValue(range)
    }

    return (
      <div
        {...mergeProps(calendarProps, rest)}
        className={classNames('datepicker', className)}
        data-cx-inline="true"
        ref={ref}
      >
        <div className="datepicker-grid">
          {resolvedPresets && (
            <DateRangePresets
              onSelect={handlePresetSelect}
              presets={resolvedPresets}
              value={state.value}
            />
          )}
          <div className="datepicker-column cx-calendar-body">
            {visibleMonths > 1 && (
              <div className="datepicker-controls">
                {prevButton}
                {nextButton}
              </div>
            )}
            <div className="datepicker-grid">
              {[...new Array(visibleMonths).keys()].map((monthIndex) => (
                <CalendarMonth
                  arrows={monthIndex === 0 ? singleMonthArrows : null}
                  firstDayOfWeek={firstDayOfWeek}
                  key={monthIndex}
                  locale={locale}
                  monthIndex={monthIndex}
                  state={state}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CxRangeCalendar.displayName = 'CxRangeCalendar'

interface CalendarMonthYearDropdownsProps {
  locale: string
  monthIndex: number
  monthStart: CalendarDate
  state: RangeCalendarState
}

// Each visible month gets its own month/year dropdowns rather than one shared pair — react-aria's
// own `useCalendarMonthPicker`/`useCalendarYearPicker` always read/write `state.focusedDate`, i.e.
// only the first visible month, so they can't drive a second or third month's dropdowns on their
// own. This mirrors their logic (same option lists, same `min`/`maxValue` clamping) but anchored to
// this month's own `monthStart` instead, and re-targets `state.setFocusedDate` by subtracting this
// month's offset — so picking a month/year here still moves `state.focusedDate` (and therefore
// every visible month, since they're all computed from that one anchor) in sync.
const CalendarMonthYearDropdowns = ({
  locale,
  monthIndex,
  monthStart,
  state
}: CalendarMonthYearDropdownsProps) => {
  const monthFormatter = useDateFormatter({
    calendar: monthStart.calendar.identifier,
    month: 'short',
    timeZone: state.timeZone
  })
  const yearFormatter = useDateFormatter({
    calendar: monthStart.calendar.identifier,
    timeZone: state.timeZone,
    year: 'numeric'
  })
  const monthFieldLabel = useMemo(
    () => new Intl.DisplayNames(locale, { type: 'dateTimeField' }).of('month'),
    [locale]
  )
  const yearFieldLabel = useMemo(
    () => new Intl.DisplayNames(locale, { type: 'dateTimeField' }).of('year'),
    [locale]
  )

  const months = useMemo(() => {
    const numMonths = monthStart.calendar.getMonthsInYear(monthStart)
    return [...new Array(numMonths).keys()].map((i) => {
      const date = monthStart.set({ month: i + 1 })
      return { date, formatted: monthFormatter.format(date.toDate(state.timeZone)), id: i + 1 }
    })
  }, [monthFormatter, monthStart, state.timeZone])

  const years = useMemo(() => {
    const visibleYears = 20
    let minDate = monthStart.subtract({ years: Math.floor(visibleYears / 2) })
    let maxDate = monthStart.add({ years: Math.ceil(visibleYears / 2) - 1 })
    if (state.maxValue && maxDate.compare(state.maxValue) > 0) {
      maxDate = toCalendarDate(state.maxValue)
      minDate = maxDate.subtract({ years: visibleYears - 1 })
    }
    if (state.minValue && minDate.compare(state.minValue) < 0) {
      minDate = toCalendarDate(state.minValue)
      maxDate = minDate.add({ years: visibleYears - 1 })
      if (state.maxValue && maxDate.compare(state.maxValue) > 0) {
        maxDate = toCalendarDate(state.maxValue)
      }
    }
    const items: { date: CalendarDate; formatted: string; id: number }[] = []
    let date = minDate
    while (date.compare(maxDate) <= 0) {
      items.push({
        date,
        formatted: yearFormatter.format(date.toDate(state.timeZone)),
        id: items.length
      })
      date = date.add({ years: 1 })
    }
    return items
  }, [monthStart, state.maxValue, state.minValue, state.timeZone, yearFormatter])

  const yearValue = years.findIndex((year) => isSameYear(year.date, monthStart))

  const handleMonthChange = (id: number) => {
    const target = months.find((month) => month.id === id)
    if (target) state.setFocusedDate(target.date.subtract({ months: monthIndex }))
  }

  const handleYearChange = (id: number) => {
    const target = years[id]
    if (target) state.setFocusedDate(target.date.subtract({ months: monthIndex }))
  }

  return (
    <div className="datepicker-header-content">
      <select
        aria-label={monthFieldLabel}
        className="cx-calendar-select"
        disabled={state.isDisabled}
        onChange={(e) => handleMonthChange(Number(e.target.value))}
        value={monthStart.month}
      >
        {months.map((month) => (
          <option key={month.id} value={month.id}>
            {month.formatted}
          </option>
        ))}
      </select>
      <select
        aria-label={yearFieldLabel}
        className="cx-calendar-select"
        disabled={state.isDisabled}
        onChange={(e) => handleYearChange(Number(e.target.value))}
        value={yearValue}
      >
        {years.map((year) => (
          <option key={year.id} value={year.id}>
            {year.formatted}
          </option>
        ))}
      </select>
    </div>
  )
}

interface CalendarMonthProps {
  arrows?: { next: ReactNode; prev: ReactNode } | null
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  locale: string
  monthIndex: number
  state: RangeCalendarState
}

// One visible month within `visibleMonths` — `useCalendarGrid`'s `startDate` is exactly what's
// needed to locate this month's own start within the shared `state`. Its header carries this
// month's own month/year dropdowns, plus the prev/next arrows too when it's the only visible
// month (`arrows` is `null` whenever a global overlay is handling paging instead — see the parent).
const CalendarMonth = ({
  arrows,
  firstDayOfWeek,
  locale,
  monthIndex,
  state
}: CalendarMonthProps) => {
  const monthStart = state.visibleRange.start.add({ months: monthIndex })
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    { firstDayOfWeek, startDate: monthStart },
    state
  )

  return (
    <div className="datepicker-column">
      <div className="datepicker-header">
        {arrows?.prev}
        <CalendarMonthYearDropdowns
          locale={locale}
          monthIndex={monthIndex}
          monthStart={monthStart}
          state={state}
        />
        {arrows?.next}
      </div>
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

interface DateRangePresetsProps {
  onSelect: (range: RangeValue<DateValue>) => void
  presets: CxDateRangePreset[]
  value: RangeValue<DateValue> | null
}

// A preset "matches" the current selection when both endpoints land on the same day — the same
// granularity `CalendarCell` already uses to compare dates, so a preset stays marked selected
// regardless of whether `value` is a `CalendarDate`, `CalendarDateTime`, or `ZonedDateTime`.
const isSameRange = (a: RangeValue<DateValue>, b: RangeValue<DateValue>) =>
  isSameDay(a.start, b.start) && isSameDay(a.end, b.end)

// Plain buttons in a list, not a listbox — a group of independent actions (each one commits
// immediately) rather than a single-selection widget, so native Tab/Enter/Space is the right
// interaction model without extra roving-tabindex/arrow-key wiring.
const DateRangePresets = ({ onSelect, presets, value }: DateRangePresetsProps) => (
  <ul className="cx-calendar-presets">
    {presets.map((preset) => {
      const isSelected = Boolean(value && isSameRange(value, preset.range))

      return (
        <li key={preset.label}>
          <button
            aria-current={isSelected ? 'true' : undefined}
            className={classNames('cx-calendar-preset', { selected: isSelected })}
            onClick={() => onSelect(preset.range)}
            type="button"
          >
            {preset.label}
          </button>
        </li>
      )
    })}
  </ul>
)
