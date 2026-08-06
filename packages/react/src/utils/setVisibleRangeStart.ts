import { flushSync } from 'react-dom'
import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate } from '@internationalized/date'

// Moves a (possibly multi-month) calendar's visible range so it starts at `desiredStart` — used by
// `CalendarMonthYearPicker` to jump straight to a picked month/year, in any visible block.
//
// `state.setFocusedDate` is the only way to move `visibleRange` from outside react-stately, but it
// doesn't just set `visibleRange.start` to wherever focus goes: react-stately keeps the visible
// range as separate internal state, only repositioning it when the newly focused date falls
// entirely *before* the current range (realigning so the range *ends* at that date's month) or
// entirely *after* it (realigning so it *starts* there) — a focused date that lands inside the
// current range moves focus without paging the range at all. That means a single `setFocusedDate`
// call can only land exactly on an arbitrary `desiredStart` when it's at least a full
// `visibleDuration` away from the current range. Anything closer — the common case here, since
// adjacent blocks in a multi-month calendar are only one month apart — either no-ops (desired
// start still inside the current range) or overshoots by up to a full `visibleDuration` (desired
// start just outside it, but not far enough for the realignment to land exactly).
//
// Worked around with two `setFocusedDate` hops when a single one can't reach exactly: first past
// `desiredStart` by one extra `visibleDuration` in the same direction (always far enough to land
// exactly, by the same rule), flushed synchronously so `visibleRange` actually updates before the
// second call runs, then back onto `desiredStart` itself — which, relative to that intermediate
// range, is now exactly one `visibleDuration` away and so lands exactly too.
export const setVisibleRangeStart = (
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState,
  desiredStart: CalendarDate
): void => {
  const { start: currentStart, end: currentEnd } = state.visibleRange
  if (desiredStart.compare(currentStart) === 0) return

  const durationMonths = state.visibleDuration.months || 1
  const isForward = desiredStart.compare(currentStart) > 0

  const reachableInOneHop = isForward
    ? desiredStart.compare(currentEnd) > 0
    : desiredStart.add({ months: durationMonths - 1 }).compare(currentStart) < 0

  if (reachableInOneHop) {
    state.setFocusedDate(focusedDateForStart(desiredStart, isForward, durationMonths))
    return
  }

  const overshootStart = isForward
    ? desiredStart.add({ months: durationMonths })
    : desiredStart.subtract({ months: durationMonths })

  flushSync(() => {
    state.setFocusedDate(focusedDateForStart(overshootStart, isForward, durationMonths))
  })
  // Relative to the now-updated range, `desiredStart` sits exactly one `visibleDuration` back the
  // way we came — always far enough for a single hop to land exactly.
  state.setFocusedDate(focusedDateForStart(desiredStart, !isForward, durationMonths))
}

// react-stately's forward-paging realignment anchors the new range to whatever month
// `focusedDate` itself falls in; its backward-paging one anchors it `visibleDuration - 1` months
// *before* `focusedDate`'s month instead — so landing on a specific desired start takes a
// different `focusedDate` depending on which of the two is going to fire.
const focusedDateForStart = (
  desiredStart: CalendarDate,
  isForward: boolean,
  durationMonths: number
): CalendarDate => (isForward ? desiredStart : desiredStart.add({ months: durationMonths - 1 }))
