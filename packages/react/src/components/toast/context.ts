import { createContext, Dispatch, SetStateAction } from 'react'

export interface ToastContextProps {
  visible?: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}

export const ToastContext = createContext({} as ToastContextProps)
