import { createContext } from 'react'

export interface ToastContextProps {
  /**
   * Whether the toast is currently visible.
   */
  visible?: boolean
  /**
   * Dismisses the toast. Wire this to any element's `onClick` — see `useToast`.
   */
  close: () => void
}

export const ToastContext = createContext<ToastContextProps>({ close: () => {} })
