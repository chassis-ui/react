import React, { ReactNode } from 'react'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate } from '@internationalized/date'

import { CalendarMonthYearPicker } from './CalendarMonthYearPicker'
import { CalendarWeekGrid } from './CalendarWeekGrid'

interface CalendarMonthBlockProps {
  // `null`/omitted when a global prev/next pair elsewhere is paging every visible month block at
  // once (`RangeCalendar` with `visibleMonths > 1`) rather than this block having its own — see
  // that component's own `arrows` prop.
  arrows?: { next: ReactNode; prev: ReactNode } | null
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  monthIndex: number
  onViewChange: (view: 'days' | 'months' | 'years') => void
  // The individual cell differs between `Calendar` and `RangeCalendar` (range selection needs
  // start/end/in-between pill state a single-date cell has no equivalent for), so cell rendering
  // is left to the caller — same shape `CalendarWeekGrid` itself already expects.
  renderCell: (date: CalendarDate, index: number, week: (CalendarDate | null)[]) => ReactNode
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState
}

// One visible month within `visibleMonths` — shared by `Calendar` and `RangeCalendar`, which
// otherwise duplicated this wiring near-verbatim. `monthIndex` is the offset of this block's own
// month from `state.focusedDate` (`0` for a single-month calendar), letting `setVisibleRangeStart`
// (inside `CalendarMonthYearPicker`) land a pick correctly regardless of which visible block it
// came from.
export const CalendarMonthBlock = ({
  arrows,
  firstDayOfWeek,
  monthIndex,
  onViewChange,
  renderCell,
  state
}: CalendarMonthBlockProps) => {
  const monthStart = state.visibleRange.start.add({ months: monthIndex })

  return (
    <>
      <CalendarMonthYearPicker
        monthIndex={monthIndex}
        monthStart={monthStart}
        nextArrow={arrows?.next}
        onViewChange={onViewChange}
        prevArrow={arrows?.prev}
        state={state}
      >
        <CalendarWeekGrid
          firstDayOfWeek={firstDayOfWeek}
          renderCell={renderCell}
          startDate={monthStart}
          state={state}
        />
      </CalendarMonthYearPicker>
    </>
  )
}
