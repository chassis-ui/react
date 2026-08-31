import { InputGroup, InputGroupAddon, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup size="small" className="mb-medium">
        <InputGroupAddon id="inputGroup-sizing-small">Small</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-small" />
      </InputGroup>

      <InputGroup className="mb-medium">
        <InputGroupAddon id="inputGroup-sizing-default">Default</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
      </InputGroup>

      <InputGroup size="large">
        <InputGroupAddon id="inputGroup-sizing-large">Large</InputGroupAddon>
        <TextInput aria-label="Sizing example input" aria-describedby="inputGroup-sizing-large" />
      </InputGroup>
    </>
  )
}
