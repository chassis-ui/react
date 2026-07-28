import { createContext } from 'react'
import { RadioGroupState } from 'react-stately'

export const CxRadioGroupContext = createContext<RadioGroupState | null>(null)
