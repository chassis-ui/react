import React, { useMemo } from 'react'
import { useDateFormatter } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate, isSameYear, toCalendarDate } from '@internationalized/date'

import { setVisibleRangeStart } from './setVisibleRangeStart'

interface CalendarMonthYearDropdownsProps {
  locale: string
  monthIndex?: number
  monthStart: CalendarDate
  state: CalendarState | RangeCalendarState
}

// Shared by `CxCalendar` and `CxRangeCalendar` — react-aria's own `useCalendarMonthPicker`/
// `useCalendarYearPicker` only ever read/write `state.focusedDate`, i.e. only a calendar's first
// visible month, so they can't drive a second or third month's dropdowns on their own. This hand
// -rolled version generalizes to that case via `monthIndex` (the offset of this dropdown pair's
// own month from `state.focusedDate`, `0` for a single-month calendar) instead, so both single-date
// and range calendars — and every visible month within a range calendar — share one implementation.
export const CalendarMonthYearDropdowns = ({
  locale,
  monthIndex = 0,
  monthStart,
  state
}: CalendarMonthYearDropdownsProps) => {
  const monthFormatter = useDateFormatter({
    calendar: monthStart.calendar.identifier,
    month: 'long',
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
    if (target) setVisibleRangeStart(state, target.date.subtract({ months: monthIndex }))
  }

  const handleYearChange = (id: number) => {
    const target = years[id]
    if (target) setVisibleRangeStart(state, target.date.subtract({ months: monthIndex }))
  }

  return (
    <div className="datepicker-header-content">
      <select
        aria-label={monthFieldLabel}
        className="datepicker-month"
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
        className="datepicker-year"
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
