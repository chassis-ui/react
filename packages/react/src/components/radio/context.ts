import { createContext } from 'react'
import { RadioGroupState } from 'react-stately'

export interface RadioGroupContextValue {
  state: RadioGroupState
  /**
   * `RadioGroup`'s own `valid` prop, mirrored here since it has no react-stately equivalent to
   * read off `state` the way `isInvalid` does — each `Radio` needs it to apply its own
   * `is-valid` class.
   */
  valid?: boolean
  /**
   * The ids of the group's description and error message, when they are rendered. Each item is
   * described by them too.
   */
  describedBy?: string
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)
