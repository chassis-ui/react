import React, { forwardRef, HTMLAttributes } from 'react'

import { useToastRegionQueue } from '../../hooks'
import { Stack } from '../stack'
import { Notification } from './Notification'
import { notificationQueue } from './notificationQueue'

export interface NotificationStackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Queued notifications show newest-first by default — the typical toast pattern. Set
   * `reverse` for a chronological transcript instead, oldest-first.
   */
  reverse?: boolean
}

// Renders the shared `notificationQueue` (see `notificationQueue.ts` — `addNotification()` is
// how notifications get added to it from anywhere in the app) plus any statically-passed
// `children`, e.g. a permanently pinned notification alongside dynamic ones — the same static
// children still render with nothing queued, so this doubles as a plain grouping/spacing
// wrapper for hand-placed notifications. Unlike `Toaster`, this always renders in normal
// document flow rather than a fixed/portaled overlay — Chassis notifications are in-page
// banners, not floating toasts.
export const NotificationStack = forwardRef<HTMLDivElement, NotificationStackProps>(
  ({ children, className, reverse, ...rest }, ref) => {
    const { forkedRef, regionProps, state } = useToastRegionQueue(notificationQueue, ref)

    if (state.visibleToasts.length === 0 && !children) {
      return null
    }

    // The queue is already newest-first (each add unshifts); `reverse` opts into chronological
    // order instead.
    const queued = reverse ? [...state.visibleToasts].reverse() : state.visibleToasts

    return (
      <Stack
        direction="vertical"
        gap="small"
        className={className}
        {...regionProps}
        {...rest}
        ref={forkedRef}
      >
        {children}
        {queued.map((item) => {
          const { children: notificationChildren, ...notificationProps } = item.content
          return (
            <Notification
              key={item.key}
              {...notificationProps}
              onClose={() => state.close(item.key)}
            >
              {notificationChildren}
            </Notification>
          )
        })}
      </Stack>
    )
  }
)

NotificationStack.displayName = 'NotificationStack'
