import { ReactNode } from 'react'
import { ToastQueue } from 'react-stately'

import { ToastProps } from './Toast'

// What `Toaster` spreads onto the `<Toast>` it renders for a queued toast: every `Toast` prop
// that describes the toast itself. The queue owns whether it is shown.
export interface ToastContent extends Pick<
  ToastProps,
  | 'animation'
  | 'autohide'
  | 'closeButton'
  | 'closeLabel'
  | 'color'
  | 'delay'
  | 'footer'
  | 'icon'
  | 'message'
  | 'role'
  | 'solid'
  | 'time'
  | 'title'
  | 'translucent'
> {
  /**
   * Content of the toast. Compose manually (typically a `ToastHeader`/`ToastBody`/
   * `ToastFooter`), or leave empty and use the `title`/`message`/`footer` shorthand options
   * instead.
   */
  children?: ReactNode
}

// The queue backing `Toaster` — a module-level singleton so `addToast()` is callable from
// anywhere (an event handler, an async callback) without threading a `push` prop through
// render. `Toaster` subscribes to it via `useToastQueue`; nothing renders until a
// `<Toaster />` is actually mounted somewhere to display the queue's contents.
export const toastQueue = new ToastQueue<ToastContent>()

// Adds a toast to the queue. Returns the toast's key, which can be passed to `closeToast` to
// dismiss it programmatically. `children` is optional — omit it for a toast composed entirely
// from the `title`/`message`/`footer` shorthand options.
export function addToast(
  children?: ReactNode,
  options: Omit<ToastContent, 'children'> = {}
): string {
  return toastQueue.add({ children, ...options })
}

// Removes a queued toast immediately, bypassing its own exit animation.
export function closeToast(key: string): void {
  toastQueue.close(key)
}
