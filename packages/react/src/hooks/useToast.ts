import { useContext } from 'react'
import { ToastContext, ToastContextProps } from '../components/toast/context'

export type UseToastResult = ToastContextProps

// Reach the enclosing `Toast`'s dismiss handler from anywhere in its composed markup — e.g. to
// close it from a plain `Button` placed in a `ToastFooter`, instead of a dedicated close
// component. Only meaningful inside a `Toast`; outside one it returns a no-op `close`.
export const useToast = (): UseToastResult => useContext(ToastContext)
