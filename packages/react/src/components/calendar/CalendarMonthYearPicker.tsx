import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { useDateFormatter } from 'react-aria'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate } from '@internationalized/date'

import { CalendarMonthGrid } from './CalendarMonthGrid'
import { CalendarYearGrid } from './CalendarYearGrid'
import { setVisibleRangeStart } from '../../utils/setVisibleRangeStart'
import { useCalendarLabels } from './labels'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'

interface CalendarMonthYearPickerProps {
  // The day grid, shown in the default 'days' view — owned by the caller (`Calendar` and
  // `RangeCalendar` render genuinely different cells: single-date vs. range pill styling), so
  // this only decides *whether* it's showing, never how it's built.
  children: ReactNode
  monthIndex?: number
  monthStart: CalendarDate
  // `null` when a global prev/next pair elsewhere is paging every visible month block at once
  // (`RangeCalendar` with `visibleMonths > 1`) rather than this block having its own — see that
  // component's own `arrows` prop. Only ever rendered in the 'days' view; the month/year views page
  // themselves independently (`CalendarYearGrid`) or don't page at all (`CalendarMonthGrid`).
  nextArrow?: ReactNode
  // Reports this block's own view whenever it changes, so a parent rendering several blocks
  // (`RangeCalendar` with `visibleMonths > 1`) can tell when one of them has switched to the
  // year view — `CalendarYearGrid` owns its own prev/next pager in that view, which would
  // otherwise sit right underneath the parent's global `.datepicker-controls` overlay.
  onViewChange?: (view: 'days' | 'months' | 'years') => void
  prevArrow?: ReactNode
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState
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
// Shared by `Calendar` and `RangeCalendar` — `monthIndex` is the offset of this block's own
// month from `state.focusedDate` (`0` for a single-month calendar), letting `setVisibleRangeStart`
// land a pick correctly regardless of which visible block it came from.
export const CalendarMonthYearPicker = ({
  children,
  monthIndex = 0,
  monthStart,
  nextArrow,
  onViewChange,
  prevArrow,
  state
}: CalendarMonthYearPickerProps) => {
  const labels = useCalendarLabels()
  const [view, setView] = useState<'days' | 'months' | 'years'>('days')
  const containerRef = useRef<HTMLDivElement>(null)
  // The view focus was last moved for. Nothing moves on mount — there's no prior view to restore
  // focus from yet, and stealing focus as soon as the calendar renders would fight `autoFocus`/the
  // caller's own focus management. Compared to `view` rather than a "first render" flag: StrictMode
  // runs a mount's effects twice, and the second run took the calendar's focused day for a return
  // to the day grid, so every calendar on a page focused itself on load.
  const focusedView = useRef(view)

  const changeView = (next: 'days' | 'months' | 'years') => {
    setView(next)
    onViewChange?.(next)
  }

  // A block that unmounts in its month or year view (`visibleMonths` lowered) has left it as far
  // as the parent can tell: without this the parent's global prev/next pair stayed hidden.
  const onViewChangeRef = useRef(onViewChange)
  onViewChangeRef.current = onViewChange
  useEffect(() => () => onViewChangeRef.current?.('days'), [])

  // Switching `view` swaps in a whole new subtree, unmounting whatever was focused (the month/
  // year trigger button, or the month/year grid button just picked) — React has no reason to move
  // focus anywhere on its own, so without this it drops to `document.body`, breaking out of
  // `FocusScope`'s containment in `DatePicker`/`DateRangePicker`'s popover entirely. Lands
  // focus on the selected month/year button when entering the month/year view (falling back to
  // the first option if nothing is selected on the currently visible page), or back onto the
  // day grid's own roving-tabindex cell when returning to 'days'. With several months visible that
  // cell is often in another block (a pick focuses the first or last visible month, and backing
  // out moves nothing), so this block's header button for the view just left takes focus instead.
  useEffect(() => {
    const previousView = focusedView.current
    if (previousView === view) return
    focusedView.current = view

    const container = containerRef.current
    if (!container) return

    const target =
      view === 'days'
        ? (container.querySelector<HTMLElement>('.datepicker-date-btn[tabindex="0"]') ??
          container.querySelector<HTMLElement>(
            previousView === 'years' ? '.datepicker-year' : '.datepicker-month'
          ))
        : (container.querySelector<HTMLElement>(
            '.datepicker-months-month.selected, .datepicker-years-year.selected'
          ) ??
          container.querySelector<HTMLElement>('.datepicker-months-month, .datepicker-years-year'))

    target?.focus()
  }, [view])

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
    changeView('days')
  }

  return (
    <div className="datepicker-column" ref={containerRef}>
      {view === 'months' && (
        <CalendarMonthGrid
          announce={monthIndex === 0}
          monthStart={monthStart}
          onBack={() => changeView('days')}
          onSelect={commitAndReturn}
          state={state}
        />
      )}
      {view === 'years' && (
        <CalendarYearGrid
          announce={monthIndex === 0}
          monthStart={monthStart}
          onBack={() => changeView('days')}
          onSelect={commitAndReturn}
          state={state}
        />
      )}
      {view === 'days' && (
        <>
          <div className="datepicker-header">
            {prevArrow}
            <div className="datepicker-header-content">
              <button
                aria-label={`${labels.month}: ${monthFormatter.format(monthStart.toDate(state.timeZone))}`}
                className="datepicker-month"
                disabled={state.isDisabled}
                onClick={() => changeView('months')}
                type="button"
              >
                {monthFormatter.format(monthStart.toDate(state.timeZone))}
              </button>
              <button
                aria-label={`${labels.year}: ${yearFormatter.format(monthStart.toDate(state.timeZone))}`}
                className="datepicker-year"
                disabled={state.isDisabled}
                onClick={() => changeView('years')}
                type="button"
              >
                {yearFormatter.format(monthStart.toDate(state.timeZone))}
              </button>
            </div>
            {nextArrow}
          </div>
          {monthIndex === 0 && (
            <VisuallyHidden role="status">
              {`${monthFormatter.format(monthStart.toDate(state.timeZone))} ${yearFormatter.format(monthStart.toDate(state.timeZone))}`}
            </VisuallyHidden>
          )}
          {children}
        </>
      )}
    </div>
  )
}
