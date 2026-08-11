import React, { forwardRef, useContext } from 'react'
import { ToastContext } from './context'
import { CloseButton, CloseButtonProps } from '../close-button/CloseButton'

// `color`/`variant`/`size` are omitted: Toast already applies its own `context`/color classes
// to the `.toast` ancestor, which the default icon inherits for free. The only place these
// props ever meant anything on `ToastClose` was as a passthrough to a `component` reference
// (e.g. `Button`) — but that's the wrapped component's own styling, not ToastClose's, so it
// belongs on that component directly rather than being typed (and documented) here as if it
// were ToastClose's own concern.
export type ToastCloseProps = Omit<CloseButtonProps, 'color' | 'variant' | 'size'>

export const ToastClose = forwardRef<HTMLButtonElement | HTMLAnchorElement, ToastCloseProps>(
  ({ onClick, ...rest }, ref) => {
    const { setVisible } = useContext(ToastContext)
    const handleClick: typeof onClick = (event) => {
      onClick?.(event)
      setVisible(false)
    }
    return <CloseButton onClick={handleClick} {...rest} ref={ref} />
  }
)

ToastClose.displayName = 'ToastClose'
