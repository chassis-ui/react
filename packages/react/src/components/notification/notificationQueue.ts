import { ReactNode } from 'react'
import { ToastQueue } from 'react-stately'

import { NotificationProps } from './Notification'

export interface NotificationContent extends Pick<
  NotificationProps,
  | 'actions'
  | 'autohide'
  | 'closeLabel'
  | 'color'
  | 'delay'
  | 'dismissible'
  | 'icon'
  | 'role'
  | 'solid'
  | 'text'
  | 'title'
  | 'titleComponent'
> {
  /**
   * Content of the notification. Compose manually (typically a `NotificationIcon`/
   * `NotificationTitle`/`NotificationText`), or leave empty and use the `icon`/`title`/`text`
   * shorthand options instead.
   */
  children?: ReactNode
}

// The queue backing `NotificationStack` — a module-level singleton so `addNotification()` is
// callable from anywhere (an event handler, an async callback) without threading a `push` prop
// through render. `NotificationStack` subscribes to it via `useToastQueue`; nothing renders
// until a `<NotificationStack />` is actually mounted somewhere to display the queue's contents.
export const notificationQueue = new ToastQueue<NotificationContent>()

// Adds a notification to the queue. Returns the notification's key, which can be passed to
// `closeNotification` to dismiss it programmatically. `children` is optional — omit it for a
// notification composed entirely from the `icon`/`title`/`text` shorthand options.
export function addNotification(
  children?: ReactNode,
  options: Omit<NotificationContent, 'children'> = {}
): string {
  return notificationQueue.add({ children, ...options })
}

// Removes a queued notification immediately, bypassing its own exit animation.
export function closeNotification(key: string): void {
  notificationQueue.close(key)
}
