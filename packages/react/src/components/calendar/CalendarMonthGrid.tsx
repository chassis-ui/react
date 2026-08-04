import React from 'react'
import classNames from 'classnames'
import { useDateFormatter } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate } from '@internationalized/date'

import { isWholeUnitDisabled } from './isWholeUnitDisabled'

interface CalendarMonthGridProps {
  monthStart: CalendarDate
  onBack: () => void
  onSelect: (date: CalendarDate) => void
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState
}

// The month view of `CalendarMonthYearPicker` — every month in `monthStart`'s own year, laid out
// as a static 3-column grid (no paging; picking a different year is the year view's job).
export const CalendarMonthGrid = ({
  monthStart,
  onBack,
  onSelect,
  state
}: CalendarMonthGridProps) => {
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

  const numMonths = monthStart.calendar.getMonthsInYear(monthStart)
  const months = [...new Array(numMonths).keys()].map((i) => {
    const date = monthStart.set({ day: 1, month: i + 1 })
    return { date, formatted: monthFormatter.format(date.toDate(state.timeZone)) }
  })

  return (
    <>
      <div className="datepicker-header">
        <div className="datepicker-header-content">
          <button className="datepicker-month" onClick={onBack} type="button">
            {yearFormatter.format(monthStart.toDate(state.timeZone))}
          </button>
        </div>
      </div>
      <div className="datepicker-content">
        <div
          aria-label={yearFormatter.format(monthStart.toDate(state.timeZone))}
          className="datepicker-months"
          role="listbox"
        >
          {months.map((month) => {
            const isSelected = month.date.month === monthStart.month
            const isDisabled = isWholeUnitDisabled(
              state,
              month.date,
              month.date.add({ months: 1 }).subtract({ days: 1 })
            )

            return (
              <button
                aria-selected={isSelected}
                className={classNames('datepicker-months-month', { selected: isSelected })}
                disabled={isDisabled}
                key={month.date.month}
                onClick={() => onSelect(month.date)}
                role="option"
                type="button"
              >
                {month.formatted}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
