import { FloatingInput, Select } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput label="Works with selects">
      <Select>
        <option>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Select>
    </FloatingInput>
  )
}
