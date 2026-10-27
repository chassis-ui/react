import { FocusEvent, ForwardedRef, useRef } from 'react'
import { mergeProps, ToastRegionAria, useFocusVisible, useToastRegion } from 'react-aria'
import { ToastQueue, ToastState, useToastQueue } from 'react-stately'

import { useForkedRef } from './useForkedRef'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export interface UseToastRegionQueueResult<T> {
  forkedRef: ReturnType<typeof useForkedRef<HTMLDivElement>>
  regionProps: ToastRegionAria['regionProps']
  state: ToastState<T>
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Focus for a toast that takes the place of the one that had it: its first control (its close
// button), or the toast itself.
const focusToast = (toast: HTMLElement) => {
  const control = toast.querySelector<HTMLElement>(FOCUSABLE)
  if (control) {
    control.focus()
    return
  }
  if (!toast.hasAttribute('tabindex')) toast.setAttribute('tabindex', '-1')
  toast.focus()
}

// Shared setup for `Toaster`/`NotificationStack` — both otherwise duplicated this near-verbatim:
// subscribe to a `ToastQueue` singleton, wire up react-aria's toast-region accessibility
// plumbing, and fork the caller's ref onto the same node the region hook needs. Differs only in
// which queue is passed.
//
// react-aria's region moves focus off a toast that is removed, but only among elements with
// `role="alertdialog"`. These toasts are `status` or `alert`, so one closed from the keyboard
// took focus to `<body>` with it. The region hands it on itself: to the toast that takes the
// closed one's place, or the one before it, and with none left to the element focused before
// focus entered the region. A toast closed with the pointer hands it straight back to that
// element, as react-aria's region does: the next toast, holding focus after a click it never had,
// kept its autohide paused until the user clicked somewhere else.
export function useToastRegionQueue<T>(
  queue: ToastQueue<T>,
  ref: ForwardedRef<HTMLDivElement>
): UseToastRegionQueueResult<T> {
  const state = useToastQueue(queue)
  const regionRef = useRef<HTMLDivElement>(null)
  const { regionProps } = useToastRegion({}, state, regionRef)
  const forkedRef = useForkedRef(ref, regionRef)

  // The position, among the region's children, of the toast that holds focus; -1 for none.
  const focusedIndexRef = useRef(-1)
  // Where focus was before it entered the region.
  const returnFocusRef = useRef<HTMLElement | null>(null)
  // `false` while the last interaction was a pointer one.
  const { isFocusVisible } = useFocusVisible()

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const region = event.currentTarget
    focusedIndexRef.current = Array.from(region.children).findIndex((child) =>
      child.contains(event.target)
    )
    const from = event.relatedTarget
    if (from instanceof HTMLElement && !region.contains(from)) returnFocusRef.current = from
  }

  // Focus that leaves for another element is the user's. A toast taken out of the DOM leaves no
  // element to go to, and is handled below.
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const to = event.relatedTarget
    if (to && !event.currentTarget.contains(to)) {
      focusedIndexRef.current = -1
      returnFocusRef.current = null
    }
  }

  useIsomorphicLayoutEffect(() => {
    const index = focusedIndexRef.current
    if (index === -1) return
    const toasts = regionRef.current
      ? (Array.from(regionRef.current.children) as HTMLElement[])
      : []
    const active = document.activeElement
    if (active && active !== document.body) {
      // Still on its toast, which another toast closing may have moved.
      const moved = toasts.findIndex((toast) => toast.contains(active))
      if (moved !== -1) focusedIndexRef.current = moved
      return
    }
    const next = isFocusVisible ? (toasts[index] ?? toasts[index - 1]) : undefined
    if (next) {
      focusToast(next)
      return
    }
    focusedIndexRef.current = -1
    const back = returnFocusRef.current
    returnFocusRef.current = null
    if (back?.isConnected) back.focus()
  }, [state.visibleToasts])

  return { forkedRef, regionProps: mergeProps(regionProps, { onFocus, onBlur }), state }
}
