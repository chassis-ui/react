import { CxSelect } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxSelect aria-label="Native options example">
      <option>Choose an option</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3" disabled>
        Three
      </option>
    </CxSelect>
  )
}
