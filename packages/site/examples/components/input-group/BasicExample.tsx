import { FormLabel, InputGroup, InputGroupAddon, TextInput, Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup className="mb-medium">
        <InputGroupAddon id="basic-addon1">@</InputGroupAddon>
        <TextInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
      </InputGroup>

      <InputGroup className="mb-medium">
        <TextInput
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <InputGroupAddon id="basic-addon2">@example.com</InputGroupAddon>
      </InputGroup>

      <FormLabel htmlFor="basic-url">Your vanity URL</FormLabel>
      <InputGroup className="mb-medium">
        <InputGroupAddon id="basic-addon3">https://example.com/users/</InputGroupAddon>
        <TextInput id="basic-url" aria-describedby="basic-addon3" />
      </InputGroup>

      <InputGroup className="mb-medium">
        <InputGroupAddon>$</InputGroupAddon>
        <TextInput aria-label="Amount (to the nearest dollar)" />
        <InputGroupAddon>.00</InputGroupAddon>
      </InputGroup>

      <InputGroup className="mb-medium">
        <TextInput placeholder="Username" aria-label="Username" />
        <InputGroupAddon>@</InputGroupAddon>
        <TextInput placeholder="Server" aria-label="Server" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>With textarea</InputGroupAddon>
        <Textarea aria-label="With textarea"></Textarea>
      </InputGroup>
    </>
  )
}
