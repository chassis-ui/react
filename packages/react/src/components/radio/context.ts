import { createContext } from 'react'
import { RadioGroupState } from 'react-stately'

export const RadioGroupContext = createContext<RadioGroupState | null>(null)
