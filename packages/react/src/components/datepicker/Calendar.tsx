import React, { RefObject, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaCalendarProps,
  AriaDialogProps,
  DateValue,
  mergeProps,
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useDialog
} from 'react-aria'
import { CalendarState } from 'react-stately'
import { CalendarDate, getLocalTimeZone, getWeeksInMonth, isToday } from '@internationalized/date'

interface CalendarProps {
  calendarRef: RefObject<HTMLDivElement | null>
  dialogProps: AriaDialogProps
  locale: string
  props: AriaCalendarProps<DateValue>
  state: CalendarState
}

// A fresh mount each time the popover opens (the parent only renders this component while
// `state.isOpen`) so `useDialog`'s auto-focus-on-mount effect actually fires every open — see
// `CxPopover`'s `PopoverPanel` for the same fix applied to the same underlying react-aria quirk.
export const Calendar = ({ calendarRef, dialogProps, locale, props, state }: CalendarProps) => {
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state)
  const { dialogProps: domDialogProps } = useDialog(dialogProps, calendarRef)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const { buttonProps: domPrevButtonProps } = useButton(prevButtonProps, prevRef)
  const { buttonProps: domNextButtonProps } = useButton(nextButtonProps, nextRef)

  return (
    <div
      {...mergeProps(calendarProps, domDialogProps)}
      ref={calendarRef as RefObject<HTMLDivElement>}
    >
      <div className="cx-datepicker-header">
        <button {...domPrevButtonProps} className="cx-datepicker-nav" ref={prevRef} type="button">
          ‹
        </button>
        <div className="cx-datepicker-title">{title}</div>
        <button {...domNextButtonProps} className="cx-datepicker-nav" ref={nextRef} type="button">
          ›
        </button>
      </div>
      <CalendarGrid locale={locale} state={state} />
    </div>
  )
}

interface CalendarGridProps {
  locale: string
  state: CalendarState
}

const CalendarGrid = ({ locale, state }: CalendarGridProps) => {
  const { gridProps, headerProps, weekDays } = useCalendarGrid({}, state)
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps} className="cx-datepicker-grid">
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <th className="cx-datepicker-weekday" key={index}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) =>
              date ? (
                <CalendarCell date={date} key={date.toString()} state={state} />
              ) : (
                // eslint-disable-next-line react/no-array-index-key
                <td key={i} />
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface CalendarCellProps {
  date: CalendarDate
  state: CalendarState
}

const CalendarCell = ({ date, state }: CalendarCellProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    isFocused,
    formattedDate
  } = useCalendarCell({ date }, state, ref)

  return (
    <td {...cellProps} className="cx-datepicker-cell">
      <div
        {...buttonProps}
        className={classNames('cx-datepicker-cell-button', {
          selected: isSelected,
          today: isToday(date, getLocalTimeZone()),
          outside: isOutsideVisibleRange,
          disabled: isDisabled,
          unavailable: isUnavailable,
          focused: isFocused
        })}
        ref={ref}
      >
        {formattedDate}
      </div>
    </td>
  )
}
