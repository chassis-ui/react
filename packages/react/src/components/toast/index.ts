import { Toast as ToastRoot } from './Toast'
import { ToastBody } from './ToastBody'
import { ToastClose } from './ToastClose'
import { ToastFooter } from './ToastFooter'
import { ToastHeader } from './ToastHeader'
// plop:sub-import

export const Toast = Object.assign(ToastRoot, {
  // plop:sub-entry
  Body: ToastBody,
  Close: ToastClose,
  Footer: ToastFooter,
  Header: ToastHeader
})
export type { ToastProps } from './Toast'
export type { ToastBodyProps } from './ToastBody'
export type { ToastCloseProps } from './ToastClose'
export type { ToastFooterProps } from './ToastFooter'
export type { ToastHeaderProps } from './ToastHeader'
// plop:sub-type

// Toaster is an independent manager/container component (react-hot-toast-style), not a Toast
// sub-part — it subscribes to the shared toastQueue and renders Toast instances from it, rather
// than being composed as a child of Toast. Stays a separate top-level export.
export { Toaster } from './Toaster'
export type { ToasterProps } from './Toaster'
export { addToast, closeToast, toastQueue } from './toastQueue'
export type { ToastContent } from './toastQueue'
