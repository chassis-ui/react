import { InputGroup as InputGroupRoot } from './InputGroup'
import { InputAddon } from './InputAddon'
// plop:sub-import

export const InputGroup = Object.assign(InputGroupRoot, {
  // plop:sub-entry
  Addon: InputAddon
})
export type { InputGroupProps } from './InputGroup'
export type { InputAddonProps } from './InputAddon'
// plop:sub-type
