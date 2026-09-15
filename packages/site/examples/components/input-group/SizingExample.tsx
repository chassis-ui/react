import { InputGroup, InputGroupAddon, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup size="sm" className="mb-md">
        <InputGroupAddon id="inputGroup-sizing-sm">Small</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
      </InputGroup>

      <InputGroup className="mb-md">
        <InputGroupAddon id="inputGroup-sizing-default">Default</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
      </InputGroup>

      <InputGroup size="lg">
        <InputGroupAddon id="inputGroup-sizing-lg">Large</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
      </InputGroup>
    </>
  )
}
