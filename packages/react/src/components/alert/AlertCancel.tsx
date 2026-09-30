import React, { forwardRef, MouseEvent } from 'react'

import { Button, ButtonProps } from '../button/Button'
import { useAlertContext } from './Alert'

export type AlertCancelProps = Omit<ButtonProps<'button'>, 'asChild' | 'component' | 'href'>

// The least destructive action: it closes the alert, and it has focus when the alert opens, as
// an alert dialog should (WAI-ARIA APG). An element of your own with `data-autofocus` earlier in
// the alert takes focus instead.
export const AlertCancel = forwardRef<HTMLButtonElement, AlertCancelProps>(
  ({ color = 'default', onClick, ...rest }, ref) => {
    const { close } = useAlertContext()
    return (
      <Button
        color={color}
        data-autofocus=""
        {...rest}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          onClick?.(event)
          if (!event.defaultPrevented) close()
        }}
        ref={ref}
      />
    )
  }
)

AlertCancel.displayName = 'AlertCancel'
