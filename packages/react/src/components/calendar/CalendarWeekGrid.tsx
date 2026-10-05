import React, { ReactNode } from 'react'
import { useCalendarGrid } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate, isSameMonth } from '@internationalized/date'

interface CalendarWeekGridProps {
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  renderCell: (
    date: CalendarDate,
    index: number,
    week: (CalendarDate | null)[],
    isOutsideMonth: boolean
  ) => ReactNode
  startDate?: CalendarDate
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState
}

// Shared week-day header + date-rows grid, used by both `Calendar` and `RangeCalendar` —
// `startDate` lets a range calendar anchor this to one of several visible months (see
// `useCalendarGrid`'s own docs); omitted, it defaults to the calendar's own visible start. Only the
// individual cell differs between the two callers (range selection needs start/end/in-between pill
// state a single-date cell has no equivalent for), so cell rendering is left to `renderCell`.
//
// A week at either end of the month holds days of the month next to it. With several months
// visible those days are inside the calendar's visible range, so react-aria can't tell them from
// the month's own: `renderCell` is told, and hands it on to `useCalendarCell` as `isOutsideMonth`.
// Otherwise the day shows twice, in this grid and in its own month's, both selectable and both
// taking focus.
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
  const monthStart = startDate ?? state.visibleRange.start

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
                  <React.Fragment key={date.toString()}>
                    {renderCell(date, i, week, !isSameMonth(date, monthStart))}
                  </React.Fragment>
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
