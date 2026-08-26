import { createContext } from 'react'
import { CheckboxGroupState } from 'react-stately'

export interface CheckboxGroupContextValue {
  state: CheckboxGroupState
  /**
   * `CheckboxGroup`'s own `valid` prop, mirrored here since it has no react-stately equivalent to
   * read off `state` the way `isInvalid` does — each `Checkbox` needs it to apply its own
   * `is-valid` class when the item doesn't set its own (same pattern as `RadioGroupContext`).
   */
  valid?: boolean
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)
