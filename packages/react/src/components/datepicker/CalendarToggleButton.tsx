import React, { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'
import { OverlayTriggerState } from 'react-stately'

interface CalendarToggleButtonProps {
  buttonProps: AriaButtonProps
  state: OverlayTriggerState
}

// Shared by `CxDatePicker` and `CxDateRangePicker` — both trigger their calendar popover with an
// identical calendar-icon button. `buttonProps.onPress` (from that caller's own `useDatePicker`/
// `useDateRangePicker`) only ever opens the popover (matches upstream react-aria), so re-clicking
// the button while it's already open would otherwise do nothing — overridden here to actually
// toggle.
export const CalendarToggleButton = ({ buttonProps, state }: CalendarToggleButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps: toggleProps } = useButton(
    { ...buttonProps, onPress: () => state.toggle() },
    ref
  )

  return (
    <button {...toggleProps} className="input-adorn" ref={ref} type="button">
      <svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          height="12"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.25"
          width="13"
          x="1.5"
          y="3"
        />
        <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M4.5 1.5v3M11.5 1.5v3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.25"
        />
      </svg>
    </button>
  )
}
