import { InputGroup, InputGroupAddon, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <InputGroup>
      <InputGroupAddon>First and last name</InputGroupAddon>
      <TextInput aria-label="First name" />
      <TextInput aria-label="Last name" />
    </InputGroup>
  )
}
