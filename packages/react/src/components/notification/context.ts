import { createContext } from 'react'

export interface NotificationContextProps {
  /**
   * Whether the notification is currently visible.
   */
  visible?: boolean
  /**
   * Dismisses the notification. Wire this to any element's `onClick` — see `useNotification`.
   */
  close: () => void
}

export const NotificationContext = createContext<NotificationContextProps>({ close: () => {} })
