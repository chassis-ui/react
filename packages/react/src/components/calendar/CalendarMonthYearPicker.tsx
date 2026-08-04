import React, { ReactNode, useState } from 'react'
import { useDateFormatter } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate } from '@internationalized/date'

import { CalendarMonthGrid } from './CalendarMonthGrid'
import { CalendarYearGrid } from './CalendarYearGrid'
import { setVisibleRangeStart } from './setVisibleRangeStart'

interface CalendarMonthYearPickerProps {
  // The day grid, shown in the default 'days' view — owned by the caller (`CxCalendar` and
  // `CxRangeCalendar` render genuinely different cells: single-date vs. range pill styling), so
  // this only decides *whether* it's showing, never how it's built.
  children: ReactNode
  monthIndex?: number
  monthStart: CalendarDate
  // `null` when a global prev/next pair elsewhere is paging every visible month block at once
  // (`CxRangeCalendar` with `visibleMonths > 1`) rather than this block having its own — see that
  // component's own `arrows` prop. Only ever rendered in the 'days' view; the month/year views page
  // themselves independently (`CalendarYearGrid`) or don't page at all (`CalendarMonthGrid`).
  nextArrow?: ReactNode
  prevArrow?: ReactNode
  state: CalendarState | RangeCalendarState
}

// Header + body for one visible month block: the day grid by default, switching in place to a
// month or year grid when the header's own month/year button is pressed (chassis-css's actual
// `_datepicker.scss` design for this — `[data-vc="months"]`/`[data-vc="years"]`, swapped in for
// `[data-vc="dates"]` — not a `<select>`, which is what this component used to render here. Native
// `<select>` turned out to be the whole problem: picking a value forced a synchronous re-render
// from inside the browser's own `change`-event dispatch, and in Safari that corrupted `usePress`'s
// pointerup-vs-click target check for whatever the user clicked next — a page bug specific to
// native form controls, not present here since a grid button is a plain, ordinary press.
//
// Shared by `CxCalendar` and `CxRangeCalendar` — `monthIndex` is the offset of this block's own
// month from `state.focusedDate` (`0` for a single-month calendar), letting `setVisibleRangeStart`
// land a pick correctly regardless of which visible block it came from.
export const CalendarMonthYearPicker = ({
  children,
  monthIndex = 0,
  monthStart,
  nextArrow,
  prevArrow,
  state
}: CalendarMonthYearPickerProps) => {
  const [view, setView] = useState<'days' | 'months' | 'years'>('days')

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

  const commitAndReturn = (date: CalendarDate) => {
    setVisibleRangeStart(state, date.subtract({ months: monthIndex }))
    setView('days')
  }

  if (view === 'months') {
    return (
      <CalendarMonthGrid
        monthStart={monthStart}
        onBack={() => setView('days')}
        onSelect={commitAndReturn}
        state={state}
      />
    )
  }

  if (view === 'years') {
    return (
      <CalendarYearGrid
        monthStart={monthStart}
        onBack={() => setView('days')}
        onSelect={commitAndReturn}
        state={state}
      />
    )
  }

  return (
    <>
      <div className="datepicker-header">
        {prevArrow}
        <div className="datepicker-header-content">
          <button
            aria-label={`Month: ${monthFormatter.format(monthStart.toDate(state.timeZone))}`}
            className="datepicker-month"
            disabled={state.isDisabled}
            onClick={() => setView('months')}
            type="button"
          >
            {monthFormatter.format(monthStart.toDate(state.timeZone))}
          </button>
          <button
            aria-label={`Year: ${yearFormatter.format(monthStart.toDate(state.timeZone))}`}
            className="datepicker-year"
            disabled={state.isDisabled}
            onClick={() => setView('years')}
            type="button"
          >
            {yearFormatter.format(monthStart.toDate(state.timeZone))}
          </button>
        </div>
        {nextArrow}
      </div>
      {children}
    </>
  )
}
