import React, { forwardRef, HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import { useToastRegionQueue } from '../../hooks'
import { Toast } from './Toast'
import { toastQueue } from './toastQueue'

export interface ToasterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Overrides the toast region's accessible name (defaults to `'Notifications'`, per
   * react-aria). Set this for non-English UIs, or to distinguish multiple toasters on the
   * same page.
   */
  'aria-label'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Describes the placement of your component.
   *
   * @type 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end' | string
   */
  placement?:
    | 'top-start'
    | 'top-center'
    | 'top-end'
    | 'middle-start'
    | 'middle-center'
    | 'middle-end'
    | 'bottom-start'
    | 'bottom-center'
    | 'bottom-end'
    | string
}

// Renders the shared `toastQueue` (see `toastQueue.ts` — `addToast()` is how toasts get added
// to it from anywhere in the app) plus any statically-passed `children`, e.g. a permanently
// pinned toast alongside dynamic ones.
export const Toaster = forwardRef<HTMLDivElement, ToasterProps>(
  ({ children, className, placement, ...rest }, ref) => {
    const { forkedRef, regionProps, state } = useToastRegionQueue(toastQueue, ref)

    const _className = classNames(
      'toaster toast-container p-medium',
      {
        'position-fixed': placement,
        'position-static': !placement,
        'top-0': placement && placement.includes('top'),
        'top-50 translate-middle-y': placement && placement.includes('middle'),
        'bottom-0': placement && placement.includes('bottom'),
        'start-0': placement && placement.includes('start'),
        'start-50 translate-middle-x': placement && placement.includes('center'),
        'end-0': placement && placement.includes('end')
      },
      className
    )

    const toaster = (toasterRef?: React.Ref<HTMLDivElement>) => {
      return state.visibleToasts.length > 0 || children ? (
        <div className={_className} {...regionProps} {...rest} ref={toasterRef}>
          {children}
          {state.visibleToasts.map((queued) => {
            const { children: toastChildren, ...toastProps } = queued.content
            return (
              <Toast
                key={queued.key}
                visible
                {...toastProps}
                onClose={() => state.close(queued.key)}
              >
                {toastChildren}
              </Toast>
            )
          })}
        </div>
      ) : null
    }

    return typeof window !== 'undefined' && placement
      ? createPortal(toaster(forkedRef), document.body)
      : toaster(forkedRef)
  }
)

Toaster.displayName = 'Toaster'
