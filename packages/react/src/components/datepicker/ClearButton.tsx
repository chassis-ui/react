import React, { useRef } from 'react'
import { mergeProps, useButton } from 'react-aria'

import { useSuppressFocusRingOnPointerDown } from '../../hooks'

interface ClearButtonProps {
  isDisabled?: boolean
  onPress: () => void
}

// Shared by `DatePicker` and `DateRangePicker` — a trailing "×" adornment that resets the
// current selection to empty. Rendered only while there's something to clear (see each caller's
// own conditional). `useButton` for the same reason `CalendarToggleButton` uses it: proper
// press/keyboard semantics consistent with the rest of this library, rather than a raw `onClick`.
export const ClearButton = ({ isDisabled, onPress }: ClearButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ 'aria-label': 'Clear', isDisabled, onPress }, ref)
  const suppressFocusRing = useSuppressFocusRingOnPointerDown<HTMLButtonElement>()

  return (
    <button
      {...mergeProps(buttonProps, { onPointerDown: suppressFocusRing })}
      className="input-adorn"
      ref={ref}
      type="button"
    >
      <svg
        fill="none"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.25"
        />
      </svg>
    </button>
  )
}
