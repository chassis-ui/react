'use client'

import '../../utils/suppressFocusRingGlobally'

export { Toast } from './Toast'
export type { ToastProps } from './Toast'
export { ToastBody } from './ToastBody'
export type { ToastBodyProps } from './ToastBody'
export { ToastFooter } from './ToastFooter'
export type { ToastFooterProps } from './ToastFooter'
export { ToastHeader } from './ToastHeader'
export type { ToastHeaderProps } from './ToastHeader'
export { ToastIcon } from './ToastIcon'
export type { ToastIconProps } from './ToastIcon'

// Toaster is an independent manager/container component (react-hot-toast-style), not a Toast
// sub-part — it subscribes to the shared toastQueue and renders Toast instances from it, rather
// than being composed as a child of Toast. Stays a separate top-level export.
export { Toaster } from './Toaster'
export type { ToasterProps } from './Toaster'
export { addToast, closeToast, toastQueue } from './toastQueue'
export type { ToastContent } from './toastQueue'
// Also exported from the package root; repeated here so this folder's subpath entry
// (`@chassis-ui/react/<folder>`) covers the whole family without reaching back to the root.
export { useToast } from '../../hooks/useToast'
export type { UseToastResult } from '../../hooks/useToast'
