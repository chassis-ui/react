import { ForwardedRef, useRef } from 'react'
import { ToastRegionAria, useToastRegion } from 'react-aria'
import { ToastQueue, ToastState, useToastQueue } from 'react-stately'

import { useForkedRef } from './useForkedRef'

export interface UseToastRegionQueueResult<T> {
  forkedRef: ReturnType<typeof useForkedRef<HTMLDivElement>>
  regionProps: ToastRegionAria['regionProps']
  state: ToastState<T>
}

// Shared setup for `Toaster`/`NotificationStack` — both otherwise duplicated this near-verbatim:
// subscribe to a `ToastQueue` singleton, wire up react-aria's toast-region accessibility
// plumbing, and fork the caller's ref onto the same node the region hook needs. Differs only in
// which queue is passed.
export function useToastRegionQueue<T>(
  queue: ToastQueue<T>,
  ref: ForwardedRef<HTMLDivElement>
): UseToastRegionQueueResult<T> {
  const state = useToastQueue(queue)
  const regionRef = useRef<HTMLDivElement>(null)
  const { regionProps } = useToastRegion({}, state, regionRef)
  const forkedRef = useForkedRef(ref, regionRef)

  return { forkedRef, regionProps, state }
}
