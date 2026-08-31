import React, { useState } from 'react'
import classNames from 'classnames'
import { useDateFormatter } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate, toCalendarDate } from '@internationalized/date'

import { isWholeUnitDisabled } from '../../utils/isWholeUnitDisabled'

interface CalendarYearGridProps {
  // Whether to render the visually-hidden `aria-live` announcement of this view's current header
  // (see `CalendarMonthYearPicker`'s own equivalent gate) — `false` for every visible month block
  // but the first when `visibleMonths > 1`, so switching into this view (or paging within it)
  // doesn't fire one simultaneous announcement per block.
  announce?: boolean
  monthStart: CalendarDate
  onBack: () => void
  onSelect: (date: CalendarDate) => void
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState
}

const YEARS_PER_PAGE = 15

// The year view of `CalendarMonthYearPicker` — a paged 3-column grid, `YEARS_PER_PAGE` years at a
// time starting from the currently visible year. Unlike the month view, a year range doesn't fit
// on one screen, so this owns its own prev/next paging (independent of the day grid's own
// prev/next, which keep paging by month underneath whenever this view isn't showing).
export const CalendarYearGrid = ({
  announce = true,
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
  // `years` always has exactly `YEARS_PER_PAGE` (15) entries — a fixed, non-zero constant, never
  // empty — so the first/last indices are always in range.
  const firstYear = years[0]!
  const lastYear = years[years.length - 1]!
  const firstYearStart = firstYear.yearStart
  const lastYearEnd = lastYear.yearEnd
  const rangeLabel = `${firstYear.formatted} – ${lastYear.formatted}`

  const isPrevDisabled =
    state.isDisabled ||
    (state.minValue != null &&
      firstYearStart.subtract({ days: 1 }).compare(toCalendarDate(state.minValue)) < 0)
  const isNextDisabled =
    state.isDisabled ||
    (state.maxValue != null &&
      lastYearEnd.add({ days: 1 }).compare(toCalendarDate(state.maxValue)) > 0)

  return (
    <>
      <div className="datepicker-header">
        <button
          aria-label="Previous years"
          className="datepicker-arrow datepicker-arrow-prev"
          disabled={isPrevDisabled}
          onClick={() => setPageStart((start) => start - YEARS_PER_PAGE)}
          type="button"
        />
        <div className="datepicker-header-content">
          <button className="datepicker-year" onClick={onBack} type="button">
            {rangeLabel}
          </button>
        </div>
        <button
          aria-label="Next years"
          className="datepicker-arrow datepicker-arrow-next"
          disabled={isNextDisabled}
          onClick={() => setPageStart((start) => start + YEARS_PER_PAGE)}
          type="button"
        />
      </div>
      {announce && (
        <span role="status" className="visually-hidden">
          {`Select year, ${rangeLabel}`}
        </span>
      )}
      <div className="datepicker-content">
        <div aria-label={rangeLabel} className="datepicker-years" role="group">
          {years.map((year) => {
            const isSelected = year.date.year === monthStart.year
            const isDisabled = isWholeUnitDisabled(state, year.yearStart, year.yearEnd)

            return (
              <button
                aria-current={isSelected ? 'true' : undefined}
                className={classNames('datepicker-years-year', { selected: isSelected })}
                disabled={isDisabled}
                key={year.date.year}
                onClick={() => onSelect(year.date)}
                type="button"
              >
                {year.formatted}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
