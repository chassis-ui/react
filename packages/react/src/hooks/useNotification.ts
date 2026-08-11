import { useContext } from 'react'
import { NotificationContext, NotificationContextProps } from '../components/notification/context'

export type UseNotificationResult = NotificationContextProps

// Reach the enclosing `Notification`'s dismiss handler from anywhere in its composed markup —
// e.g. to close it from a plain `Button` placed alongside other `actions`, instead of the
// built-in `dismissible` close button. Only meaningful inside a `Notification`; outside one it
// returns a no-op `close`.
export const useNotification = (): UseNotificationResult => useContext(NotificationContext)
