import { Button, FileInput, InputGroup, InputGroupAddon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup className="mb-medium">
        <InputGroupAddon component="label" htmlFor="inputGroupFile01">
          Upload
        </InputGroupAddon>
        <FileInput id="inputGroupFile01" />
      </InputGroup>

      <InputGroup className="mb-medium">
        <FileInput id="inputGroupFile02" />
        <InputGroupAddon component="label" htmlFor="inputGroupFile02">
          Upload
        </InputGroupAddon>
      </InputGroup>

      <InputGroup className="mb-medium">
        <Button type="button" color="secondary" variant="outline" id="inputGroupFileAddon03">
          Button
        </Button>
        <FileInput
          id="inputGroupFile03"
          aria-describedby="inputGroupFileAddon03"
          aria-label="Upload"
        />
      </InputGroup>

      <InputGroup>
        <FileInput
          id="inputGroupFile04"
          aria-describedby="inputGroupFileAddon04"
          aria-label="Upload"
        />
        <Button type="button" color="secondary" variant="outline" id="inputGroupFileAddon04">
          Button
        </Button>
      </InputGroup>
    </>
  )
}
