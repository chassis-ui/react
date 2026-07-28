import { createContext } from 'react'
import { CheckboxGroupState } from 'react-stately'

export const CxCheckboxGroupContext = createContext<CheckboxGroupState | null>(null)
