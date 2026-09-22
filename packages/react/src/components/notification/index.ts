'use client'

import '../../utils/suppressFocusRingGlobally'

export { Notification } from './Notification'
export type { NotificationProps } from './Notification'
export { NotificationTitle } from './NotificationTitle'
export type { NotificationTitleProps } from './NotificationTitle'
export { NotificationIcon } from './NotificationIcon'
export type { NotificationIconProps } from './NotificationIcon'
export { NotificationText } from './NotificationText'
export type { NotificationTextProps } from './NotificationText'

// NotificationStack is an independent manager/container component (react-hot-toast-style), not
// a Notification sub-part — it subscribes to the shared notificationQueue and renders
// Notification instances from it, rather than being composed as a child of Notification. Stays
// a separate top-level export, mirroring Toast/Toaster.
export { NotificationStack } from './NotificationStack'
export type { NotificationStackProps } from './NotificationStack'
export { addNotification, closeNotification, notificationQueue } from './notificationQueue'
export type { NotificationContent } from './notificationQueue'
// Also exported from the package root; repeated here so this folder's subpath entry
// (`@chassis-ui/react/<folder>`) covers the whole family without reaching back to the root.
export { useNotification } from '../../hooks/useNotification'
export type { UseNotificationResult } from '../../hooks/useNotification'
