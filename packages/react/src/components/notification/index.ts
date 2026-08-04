import { Notification as NotificationRoot } from './Notification'
import { NotificationHeading } from './NotificationHeading'
import { NotificationLink } from './NotificationLink'
// plop:sub-import

export const Notification = Object.assign(NotificationRoot, {
  // plop:sub-entry
  Heading: NotificationHeading,
  Link: NotificationLink
})
export type { NotificationProps } from './Notification'
export type { NotificationHeadingProps } from './NotificationHeading'
export type { NotificationLinkProps } from './NotificationLink'
// plop:sub-type
