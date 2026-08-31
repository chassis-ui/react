import { InputGroup, InputGroupAddon, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup className="mb-medium">
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupAddon>0.00</InputGroupAddon>
        <TextInput aria-label="Dollar amount (with dot and two decimal places)" />
      </InputGroup>

      <InputGroup>
        <TextInput aria-label="Dollar amount (with dot and two decimal places)" />
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupAddon>0.00</InputGroupAddon>
      </InputGroup>
    </>
  )
}
