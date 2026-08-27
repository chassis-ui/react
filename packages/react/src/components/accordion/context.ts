import { createContext } from 'react'

export interface AccordionContextProps {
  alwaysOpen?: boolean
  name?: string
}

export const AccordionContext = createContext<AccordionContextProps>({})
