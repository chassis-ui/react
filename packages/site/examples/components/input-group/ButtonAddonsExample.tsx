import { Button, InputGroup, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup className="mb-medium">
        <Button type="button" color="secondary" variant="outline" id="button-addon1">
          Button
        </Button>
        <TextInput
          placeholder=""
          aria-label="Example text with button addon"
          aria-describedby="button-addon1"
        />
      </InputGroup>

      <InputGroup className="mb-medium">
        <TextInput
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
        />
        <Button type="button" color="secondary" variant="outline" id="button-addon2">
          Button
        </Button>
      </InputGroup>

      <InputGroup className="mb-medium">
        <Button type="button" color="secondary" variant="outline">
          Button
        </Button>
        <Button type="button" color="secondary" variant="outline">
          Button
        </Button>
        <TextInput placeholder="" aria-label="Example text with two button addons" />
      </InputGroup>

      <InputGroup>
        <TextInput
          placeholder="Recipient's username"
          aria-label="Recipient's username with two button addons"
        />
        <Button type="button" color="secondary" variant="outline">
          Button
        </Button>
        <Button type="button" color="secondary" variant="outline">
          Button
        </Button>
      </InputGroup>
    </>
  )
}
