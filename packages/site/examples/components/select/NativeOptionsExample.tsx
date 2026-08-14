import { Select } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Select aria-label="Native options example">
      <option>Choose an option</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3" disabled>
        Three
      </option>
    </Select>
  )
}
