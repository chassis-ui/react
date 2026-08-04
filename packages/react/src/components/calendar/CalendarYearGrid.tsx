import React, { useState } from 'react'
import classNames from 'classnames'
import { useDateFormatter } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate, toCalendarDate } from '@internationalized/date'

import { isWholeUnitDisabled } from './isWholeUnitDisabled'

interface CalendarYearGridProps {
  monthStart: CalendarDate
  onBack: () => void
  onSelect: (date: CalendarDate) => void
  state: CalendarState | RangeCalendarState
}

const YEARS_PER_PAGE = 12

// The year view of `CalendarMonthYearPicker` — a paged 3-column grid, `YEARS_PER_PAGE` years at a
// time starting from the currently visible year. Unlike the month view, a year range doesn't fit
// on one screen, so this owns its own prev/next paging (independent of the day grid's own
// prev/next, which keep paging by month underneath whenever this view isn't showing).
export const CalendarYearGrid = ({
  monthStart,
  onBack,
  onSelect,
  state
}: CalendarYearGridProps) => {
  const yearFormatter = useDateFormatter({
    calendar: monthStart.calendar.identifier,
    timeZone: state.timeZone,
    year: 'numeric'
  })
  // Lazy initializer only — this view unmounts on every exit, so there's no case where `monthStart`
  // changes while it's still mounted that this would need to react to.
  const [pageStart, setPageStart] = useState(() => monthStart.year)

  // `date` preserves `monthStart`'s own month/day, changing only the year — picking a year should
  // land on the same month it started from, not reset to January (`yearStart`/`yearEnd` are the
  // Jan 1–Dec 31 bounds used only for the disabled-range check below, kept separate so the actual
  // selection target isn't affected by them).
  const years = [...new Array(YEARS_PER_PAGE).keys()].map((i) => {
    const date = monthStart.set({ year: pageStart + i })
    const yearStart = date.set({ day: 1, month: 1 })
    const yearEnd = yearStart.add({ years: 1 }).subtract({ days: 1 })
    return {
      date,
      formatted: yearFormatter.format(date.toDate(state.timeZone)),
      yearEnd,
      yearStart
    }
  })
  const firstYearStart = years[0].yearStart
  const lastYearEnd = years[years.length - 1].yearEnd
  const rangeLabel = `${years[0].formatted}–${years[years.length - 1].formatted}`

  const isPrevDisabled =
    state.isDisabled ||
    (state.minValue != null &&
      firstYearStart.subtract({ days: 1 }).compare(toCalendarDate(state.minValue)) < 0)
  const isNextDisabled =
    state.isDisabled ||
    (state.maxValue != null &&
      lastYearEnd.add({ days: 1 }).compare(toCalendarDate(state.maxValue)) > 0)

  return (
    <div className="datepicker-years-panel">
      <div className="datepicker-years-header">
        <button
          aria-label="Previous years"
          className="datepicker-arrow datepicker-arrow-prev"
          disabled={isPrevDisabled}
          onClick={() => setPageStart((start) => start - YEARS_PER_PAGE)}
          type="button"
        />
        <button className="datepicker-years-back" onClick={onBack} type="button">
          {rangeLabel}
        </button>
        <button
          aria-label="Next years"
          className="datepicker-arrow datepicker-arrow-next"
          disabled={isNextDisabled}
          onClick={() => setPageStart((start) => start + YEARS_PER_PAGE)}
          type="button"
        />
      </div>
      <div className="datepicker-years" role="listbox">
        {years.map((year) => {
          const isSelected = year.date.year === monthStart.year
          const isDisabled = isWholeUnitDisabled(state, year.yearStart, year.yearEnd)

          return (
            <button
              aria-selected={isSelected}
              className={classNames('datepicker-years-year', { selected: isSelected })}
              disabled={isDisabled}
              key={year.date.year}
              onClick={() => onSelect(year.date)}
              role="option"
              type="button"
            >
              {year.formatted}
            </button>
          )
        })}
      </div>
    </div>
  )
}
