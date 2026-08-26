import React from 'react'
import classNames from 'classnames'
import { useDateFormatter } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate } from '@internationalized/date'

import { isWholeUnitDisabled } from '../../utils/isWholeUnitDisabled'

interface CalendarMonthGridProps {
  // Whether to render the visually-hidden `aria-live` announcement of this view's current header
  // (see `CalendarMonthYearPicker`'s own equivalent gate) — `false` for every visible month block
  // but the first when `visibleMonths > 1`, so switching into this view doesn't fire one
  // simultaneous announcement per block.
  announce?: boolean
  monthStart: CalendarDate
  onBack: () => void
  onSelect: (date: CalendarDate) => void
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState
}

// The month view of `CalendarMonthYearPicker` — every month in `monthStart`'s own year, laid out
// as a static 3-column grid (no paging; picking a different year is the year view's job).
export const CalendarMonthGrid = ({
  announce = true,
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
      {announce && (
        <span role="status" className="visually-hidden">
          {`Select month, ${yearFormatter.format(monthStart.toDate(state.timeZone))}`}
        </span>
      )}
      <div className="datepicker-content">
        <div
          aria-label={yearFormatter.format(monthStart.toDate(state.timeZone))}
          className="datepicker-months"
          role="group"
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
                aria-current={isSelected ? 'true' : undefined}
                className={classNames('datepicker-months-month', { selected: isSelected })}
                disabled={isDisabled}
                key={month.date.month}
                onClick={() => onSelect(month.date)}
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
