import React, { forwardRef, HTMLAttributes, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import {
  AriaRangeCalendarProps,
  mergeProps,
  RangeValue,
  useCalendarCell,
  useLocale,
  useRangeCalendar
} from 'react-aria'
import { DateValue, RangeCalendarState, useRangeCalendarState } from 'react-stately'
import {
  CalendarDate,
  createCalendar,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfMonth,
  toCalendar,
  toCalendarDate
} from '@internationalized/date'

import { useForkedRef } from '../../hooks'
import { CalendarMonthBlock } from './CalendarMonthBlock'
import { CalendarNavButton } from './CalendarNavButton'
import { DateRangePreset } from '../../utils/dateRangePresets'
import { mergeIsDateUnavailable } from '../../utils/mergeIsDateUnavailable'
import { setVisibleRangeStart } from '../../utils/setVisibleRangeStart'
import { suppressFocusRing } from '../../utils/suppressFocusRingGlobally'
import './Calendar.scss'
import './RangeCalendar.scss'
import { CalendarLabels, CalendarLabelsProvider } from './labels'
import { useCellToday } from './todayLabel'

export interface RangeCalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the calendar, used when there's no visible label. Required for
   * standalone use — a calendar grid has no other accessible name of its own.
   */
  'aria-label'?: string
  /**
   * Identifies a visible label element for the calendar.
   */
  'aria-labelledby'?: string
  /**
   * Whether to automatically focus the calendar when it mounts.
   */
  autoFocus?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The date the calendar first shows and focuses, in place of the selected date or today.
   * `DatePicker` and `DateRangePicker` pass their `placeholderValue` here while empty.
   */
  defaultFocusedValue?: DateValue | null
  /**
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue> | null
  /**
   * Prevents the calendar from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * The day that starts the week, overriding the default set by the active locale.
   *
   * @default 'mon'
   */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue) => boolean
  /**
   * Overrides for the handful of strings this component renders itself rather than getting from
   * the active locale (the year view's paging arrows, its live-region announcements, and the
   * month/year header buttons). Everything else — month and weekday names, the calendar system —
   * follows `I18nProvider`'s locale via react-aria and needs no override. Merged over the English
   * defaults, so passing one key leaves the rest alone.
   */
  labels?: Partial<CalendarLabels>
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue | null
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue | null
  /**
   * Callback fired when a complete range is selected (both a start and end date).
   */
  onChange?: (value: RangeValue<DateValue>) => void
  /**
   * A list of quick-select range presets shown beside the calendar. Selecting a preset commits
   * its range immediately, the same as picking a start and end date from the grid. The preset
   * matching the current selection (if any) is marked selected. Omit to not show a preset list.
   */
  presets?: DateRangePreset[]
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   */
  unavailableDates?: string[]
  /**
   * The selected date range (controlled).
   */
  value?: RangeValue<DateValue> | null
  /**
   * Number of months to display side by side, sharing one selection. Wraps to multiple rows in
   * a narrow container (e.g. a popover on a sm screen) rather than overflowing — the wrap is
   * driven by the calendar's own width, not the viewport, so it adapts correctly regardless of
   * where the calendar is embedded.
   *
   * @default 1
   */
  visibleMonths?: number
}

// Range counterpart to `Calendar` — same dialog-agnostic composition boundary (see that
// component's own comment) and the same header/month-year-picker/grid visual language, reusing
// `Calendar.scss`'s shared classes directly. Kept as its own component rather than a `mode` prop
// on `Calendar`: the underlying react-stately/react-aria hooks are a genuinely different pair
// (`useRangeCalendarState`/`useRangeCalendar` vs `useCalendarState`/`useCalendar`), and the cell
// rendering has range-only concerns (start/end/in-between pill styling) with no single-date
// equivalent.
export const RangeCalendar = forwardRef<HTMLDivElement, RangeCalendarProps>(
  (
    {
      autoFocus,
      className,
      defaultFocusedValue,
      defaultValue,
      disabled,
      firstDayOfWeek = 'mon',
      isDateUnavailable,
      labels,
      maxValue,
      minValue,
      onChange,
      presets,
      unavailableDates,
      value,
      visibleMonths = 1,
      ...rest
    },
    forwardedRef
  ) => {
    const { locale } = useLocale()
    const internalRef = useRef<HTMLDivElement>(null)
    const ref = useForkedRef(internalRef, forwardedRef)
    const combinedIsDateUnavailable = useMemo(
      () => mergeIsDateUnavailable(unavailableDates, isDateUnavailable),
      [unavailableDates, isDateUnavailable]
    )
    const resolvedPresets = presets && presets.length > 0 ? presets : null
    // Tracks each visible month block's own view, keyed by `monthIndex` — needed only to know
    // whether *any* block has switched away from the day grid. `CalendarYearGrid` owns its own
    // prev/next pager, which would otherwise sit right underneath the global `.datepicker-controls`
    // overlay below (see its own comment) — and even in the month view, where there's no such
    // literal overlap, the global pager would still page the day grid one block is no longer
    // showing, which reads as it doing nothing.
    const [monthViews, setMonthViews] = useState<Record<number, 'days' | 'months' | 'years'>>({})
    const hasPickerView = Object.values(monthViews).some((view) => view !== 'days')

    const state = useRangeCalendarState({
      autoFocus,
      createCalendar,
      defaultFocusedValue,
      defaultValue,
      firstDayOfWeek,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      locale,
      maxValue,
      minValue,
      onChange,
      // Prev/next always slide the visible window by one month, regardless of `visibleMonths` —
      // react-stately's own default (`pageBehavior: 'visible'`) instead pages by the *entire*
      // visible span at once (e.g. jumping straight from Nov/Dec to Jan/Feb for `visibleMonths={2}`,
      // skipping Dec/Jan entirely), which reads as broken next to `CalendarMonthYearDropdowns`'
      // own one-month-at-a-time jumps.
      pageBehavior: 'single',
      value,
      visibleDuration: { months: visibleMonths }
    })

    const ariaProps: AriaRangeCalendarProps<DateValue> = {
      'aria-label': rest['aria-label'],
      'aria-labelledby': rest['aria-labelledby'],
      autoFocus,
      defaultFocusedValue,
      defaultValue,
      isDateUnavailable: combinedIsDateUnavailable,
      isDisabled: disabled,
      maxValue,
      minValue,
      onChange,
      value
    }

    const { calendarProps, prevButtonProps, nextButtonProps } = useRangeCalendar(
      ariaProps,
      state,
      internalRef
    )
    // A single pair of buttons, placed in exactly one spot depending on `visibleMonths` — inline
    // in the (only) month's own header for a single month, or once as a global overlay for
    // several — never both, so there's no risk of two DOM nodes fighting over one ref.
    const prevButton = <CalendarNavButton buttonProps={prevButtonProps} direction="prev" />
    const nextButton = <CalendarNavButton buttonProps={nextButtonProps} direction="next" />
    const singleMonthArrows = visibleMonths === 1 ? { next: nextButton, prev: prevButton } : null

    // Goes through the same `state.setValue` path a two-click grid selection does (rather than
    // calling `onChange` directly), so it behaves identically whether `value` is controlled or
    // uncontrolled — including `DateRangePicker`, which relies on this to auto-close its popover
    // the same way completing a range in the grid already does.
    const handlePresetSelect = (range: RangeValue<DateValue>) => {
      // A range that starts outside the visible months would be selected out of sight, so the
      // calendar moves to its first month.
      const start = toCalendar(toCalendarDate(range.start), state.focusedDate.calendar)
      const { end: visibleEnd, start: visibleStart } = state.visibleRange
      if (start.compare(visibleStart) < 0 || start.compare(visibleEnd) > 0) {
        setVisibleRangeStart(state, startOfMonth(start))
      }
      // A selection begun in the grid would otherwise stay pending over the preset's range: the
      // grid kept showing it, and the next day pressed finished it.
      state.setAnchorDate(null)
      state.setValue(range)
    }

    // Whether the grid of the month starting at `monthStart` draws `date` inside the range's band.
    // A day of another month, a disabled one and an unavailable one are not, whatever the range.
    const isInBand = (date: CalendarDate | null | undefined, monthStart: CalendarDate) =>
      Boolean(date && isSameMonth(date, monthStart) && state.isSelected(date))

    return (
      <CalendarLabelsProvider labels={labels}>
        <div
          {...mergeProps(calendarProps, rest)}
          className={classNames('datepicker', className)}
          data-cx-inline="true"
          ref={ref}
        >
          <div className="datepicker-grid">
            {resolvedPresets && (
              <DateRangePresets
                disabled={state.isDisabled}
                onSelect={handlePresetSelect}
                presets={resolvedPresets}
                value={state.value}
              />
            )}
            <div className="datepicker-body">
              {visibleMonths > 1 && !hasPickerView && (
                <div className="datepicker-controls">
                  {prevButton}
                  {nextButton}
                </div>
              )}
              <div className="datepicker-grid">
                {[...new Array(visibleMonths).keys()].map((monthIndex) => {
                  const monthStart = state.visibleRange.start.add({ months: monthIndex })

                  return (
                    <CalendarMonthBlock
                      arrows={monthIndex === 0 ? singleMonthArrows : null}
                      firstDayOfWeek={firstDayOfWeek}
                      key={monthIndex}
                      monthIndex={monthIndex}
                      onViewChange={(view) =>
                        setMonthViews((prev) => ({ ...prev, [monthIndex]: view }))
                      }
                      renderCell={(date, i, week, isOutsideMonth) => (
                        <CalendarCell
                          date={date}
                          isBandEnd={!isInBand(week[i + 1], monthStart)}
                          isBandStart={!isInBand(week[i - 1], monthStart)}
                          isOutsideMonth={isOutsideMonth}
                          locale={locale}
                          state={state}
                        />
                      )}
                      state={state}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </CalendarLabelsProvider>
    )
  }
)

RangeCalendar.displayName = 'RangeCalendar'

interface CalendarCellProps {
  date: CalendarDate
  // Whether the band stops after this day and starts at it: the day next to it in the row is
  // not drawn in the range, or there is none. That is a row's last and first day, and also a day
  // beside an unavailable or disabled one, or beside another month's.
  isBandEnd: boolean
  isBandStart: boolean
  // A day of the month before or after the one this grid shows: see `CalendarWeekGrid`.
  isOutsideMonth: boolean
  locale: string
  state: RangeCalendarState
}

const CalendarCell = ({
  date,
  isBandEnd,
  isBandStart,
  isOutsideMonth,
  locale,
  state
}: CalendarCellProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date, isOutsideMonth }, state, ref)

  // `isSelected` is true for every day in the range, not just its endpoints — the pill's rounded
  // caps belong only at the true start/end (or wherever the band breaks: a row wrapping mid-range,
  // so it still reads as continuous week to week, and a day the range can't hold, where it used
  // to stop square); everything else in between is a flush, square-edged band. An endpoint that
  // isn't drawn as selected, the copy of a day in the next month's grid, isn't drawn as one.
  const { highlightedRange } = state
  const isRangeStart = Boolean(highlightedRange && isSameDay(date, highlightedRange.start))
  const isRangeEnd = Boolean(highlightedRange && isSameDay(date, highlightedRange.end))
  // Today only once hydrated, in the class, `aria-current` and the label alike: see `useCellToday`.
  const { isCurrentDate, label } = useCellToday(date, state, isSelected, buttonProps['aria-label'])

  return (
    <div
      {...cellProps}
      aria-current={isCurrentDate ? 'date' : undefined}
      className={classNames('datepicker-date', {
        'datepicker-date-today': isCurrentDate,
        'datepicker-date-in-range': isSelected,
        'datepicker-date-range-start': isSelected && (isRangeStart || isBandStart),
        'datepicker-date-range-end': isSelected && (isRangeEnd || isBandEnd),
        'datepicker-date-outside': isOutsideVisibleRange || isOutsideMonth,
        'datepicker-date-disabled': isDisabled,
        'datepicker-date-unavailable': isUnavailable,
        'datepicker-date-weekend': isWeekend(date, locale)
      })}
    >
      <button
        {...mergeProps(buttonProps, {
          'aria-label': label,
          // Hovering to preview a range's end date moves real DOM focus via `element.focus()`
          // (`useCalendarCell`'s `onPointerEnter` -> `state.highlightDate`), which browsers can
          // paint as a visible focus ring even though the input modality is a pointer, not a
          // keyboard — suppress it the same way a mouse press does elsewhere in the library.
          onPointerEnter: () => {
            if (state.anchorDate && ref.current) suppressFocusRing(ref.current)
          },
          // react-aria leaves `tabIndex` off a day that can't be focused, which keeps its own
          // `<div>` out of the tab order but not a `<button>`.
          tabIndex: buttonProps.tabIndex ?? -1
        })}
        type="button"
        className={classNames('datepicker-date-btn', {
          'datepicker-date-range-start': isSelected && isRangeStart,
          'datepicker-date-range-end': isSelected && isRangeEnd
        })}
        ref={ref}
      >
        {formattedDate}
      </button>
    </div>
  )
}

interface DateRangePresetsProps {
  disabled: boolean
  onSelect: (range: RangeValue<DateValue>) => void
  presets: DateRangePreset[]
  value: RangeValue<DateValue> | null
}

// A preset "matches" the current selection when both endpoints land on the same day — the same
// granularity `CalendarCell` already uses to compare dates, so a preset stays marked selected
// regardless of whether `value` is a `CalendarDate`, `CalendarDateTime`, or `ZonedDateTime`.
const isSameRange = (a: RangeValue<DateValue>, b: RangeValue<DateValue>) =>
  isSameDay(a.start, b.start) && isSameDay(a.end, b.end)

// Plain buttons in a list, not a listbox — a group of independent actions (each one commits
// immediately) rather than a single-selection widget, so native Tab/Enter/Space is the right
// interaction model without extra roving-tabindex/arrow-key wiring.
const DateRangePresets = ({ disabled, onSelect, presets, value }: DateRangePresetsProps) => (
  <ul className="datepicker-presets">
    {presets.map((preset) => {
      const isSelected = Boolean(value && isSameRange(value, preset.range))

      return (
        <li key={preset.label}>
          <button
            aria-current={isSelected ? 'true' : undefined}
            className={classNames('datepicker-preset', { selected: isSelected })}
            disabled={disabled}
            onClick={() => onSelect(preset.range)}
            type="button"
          >
            {preset.label}
          </button>
        </li>
      )
    })}
  </ul>
)
