import React, { forwardRef, useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'
import { OverlayTriggerState } from 'react-stately'

import { useForkedRef } from '../../hooks'

interface CalendarToggleButtonProps {
  buttonProps: AriaButtonProps
  state: OverlayTriggerState
}

// Shared by `DatePicker` and `DateRangePicker` — both trigger their calendar overlay with an
// identical calendar-icon button. `buttonProps.onPress` (from that caller's own `useDatePicker`/
// `useDateRangePicker`) only ever opens the overlay (matches upstream react-aria), so re-clicking
// the button while it's already open would otherwise do nothing — overridden here to actually
// toggle. Forwards its ref so callers can move focus onto it explicitly — e.g. `ClearButton` sits
// immediately before it and unmounts itself on press, so focus needs somewhere to land.
export const CalendarToggleButton = forwardRef<HTMLButtonElement, CalendarToggleButtonProps>(
  ({ buttonProps, state }, forwardedRef) => {
    const internalRef = useRef<HTMLButtonElement>(null)
    const ref = useForkedRef(internalRef, forwardedRef)
    const { buttonProps: toggleProps } = useButton(
      { ...buttonProps, onPress: () => state.toggle() },
      internalRef
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
)

CalendarToggleButton.displayName = 'CalendarToggleButton'
