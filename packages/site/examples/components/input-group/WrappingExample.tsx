import { InputGroup, InputGroupAddon, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <InputGroup className="flex-nowrap">
      <InputGroupAddon id="addon-wrapping">@</InputGroupAddon>
      <TextInput placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
    </InputGroup>
  )
}
