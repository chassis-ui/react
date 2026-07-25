import { createContext } from 'react'
import { CheckboxGroupState, RadioGroupState } from 'react-stately'

export const CxCheckboxGroupContext = createContext<CheckboxGroupState | null>(null)

export const CxRadioGroupContext = createContext<RadioGroupState | null>(null)
