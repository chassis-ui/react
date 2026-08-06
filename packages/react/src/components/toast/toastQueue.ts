import { ReactNode } from 'react'
import { ToastQueue } from 'react-stately'

import { ContextColor } from '../../types'

export interface ToastContent {
  /**
   * Apply a CSS fade transition to the toast.
   */
  animation?: boolean
  /**
   * Auto hide the toast. The timer starts once the show transition completes and pauses
   * while the pointer is over the toast or focus is within it.
   */
  autohide?: boolean
  /**
   * Content of the toast — typically a `Toast.Header`/`Toast.Body`/`Toast.Footer`.
   */
  children: ReactNode
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Delay hiding the toast (ms).
   */
  delay?: number
  /**
   * Apply a full-color background with inverted text. Only meaningful alongside `color`.
   */
  solid?: boolean
  /**
   * Apply a semi-transparent background.
   */
  translucent?: boolean
}

// The queue backing `Toaster` — a module-level singleton so `addToast()` is callable from
// anywhere (an event handler, an async callback) without threading a `push` prop through
// render. `Toaster` subscribes to it via `useToastQueue`; nothing renders until a
// `<Toaster />` is actually mounted somewhere to display the queue's contents.
export const toastQueue = new ToastQueue<ToastContent>()

// Adds a toast to the queue. Returns the toast's key, which can be passed to `closeToast` to
// dismiss it programmatically.
export function addToast(
  children: ReactNode,
  options: Omit<ToastContent, 'children'> = {}
): string {
  return toastQueue.add({ children, ...options })
}

// Removes a queued toast immediately, bypassing its own exit animation.
export function closeToast(key: string): void {
  toastQueue.close(key)
}
