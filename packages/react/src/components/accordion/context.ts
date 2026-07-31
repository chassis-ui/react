import { createContext } from 'react'

export interface CxAccordionContextProps {
  alwaysOpen?: boolean
  name: string
}

export const CxAccordionContext = createContext({} as CxAccordionContextProps)
