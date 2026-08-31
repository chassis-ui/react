import React, { ReactNode } from 'react'
import { useCalendarGrid } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate } from '@internationalized/date'

interface CalendarWeekGridProps {
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  renderCell: (date: CalendarDate, index: number, week: (CalendarDate | null)[]) => ReactNode
  startDate?: CalendarDate
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState
}

// Shared week-day header + date-rows grid, used by both `Calendar` and `RangeCalendar` —
// `startDate` lets a range calendar anchor this to one of several visible months (see
// `useCalendarGrid`'s own docs); omitted, it defaults to the calendar's own visible start. Only the
// individual cell differs between the two callers (range selection needs start/end/in-between pill
// state a single-date cell has no equivalent for), so cell rendering is left to `renderCell`.
export const CalendarWeekGrid = ({
  firstDayOfWeek,
  renderCell,
  startDate,
  state
}: CalendarWeekGridProps) => {
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    { firstDayOfWeek, startDate },
    state
  )

  return (
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
          const week = state.getDatesInWeek(weekIndex, startDate)
          return (
            <div className="datepicker-dates-row" key={weekIndex} role="row">
              {week.map((date, i) =>
                date ? (
                  <React.Fragment key={date.toString()}>{renderCell(date, i, week)}</React.Fragment>
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
  )
}
