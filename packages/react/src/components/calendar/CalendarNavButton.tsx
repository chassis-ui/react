import React, { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'

interface CalendarNavButtonProps {
  buttonProps: AriaButtonProps
  direction: 'prev' | 'next'
}

// Shared prev/next arrow, used twice by both `Calendar` and `RangeCalendar` — `buttonProps`
// comes from that caller's own `useCalendar`/`useRangeCalendar`, so this only owns the DOM ref and
// the `useButton` wiring plus the arrow markup itself.
export const CalendarNavButton = ({ buttonProps, direction }: CalendarNavButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps: domButtonProps } = useButton(buttonProps, ref)

  return (
    <button
      {...domButtonProps}
      className={`datepicker-arrow datepicker-arrow-${direction}`}
      ref={ref}
      type="button"
    ></button>
  )
}
