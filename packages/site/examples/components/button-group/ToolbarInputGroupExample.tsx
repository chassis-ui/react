import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  InputGroup,
  InputGroupAddon,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <ButtonToolbar className="mb-medium" role="group" aria-label="Toolbar with button groups">
        <ButtonGroup className="me-small" role="group" aria-label="First group">
          <Button color="secondary" variant="outline">
            1
          </Button>
          <Button color="secondary" variant="outline">
            2
          </Button>
          <Button color="secondary" variant="outline">
            3
          </Button>
          <Button color="secondary" variant="outline">
            4
          </Button>
        </ButtonGroup>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput
            placeholder="Input group example"
            aria-label="Input group example"
            aria-describedby="btnGroupAddon"
          />
        </InputGroup>
      </ButtonToolbar>
      <ButtonToolbar
        className="justify-content-between"
        role="group"
        aria-label="Toolbar with button groups"
      >
        <ButtonGroup className="me-small" role="group" aria-label="First group">
          <Button color="secondary" variant="outline">
            1
          </Button>
          <Button color="secondary" variant="outline">
            2
          </Button>
          <Button color="secondary" variant="outline">
            3
          </Button>
          <Button color="secondary" variant="outline">
            4
          </Button>
        </ButtonGroup>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <TextInput
            placeholder="Input group example"
            aria-label="Input group example"
            aria-describedby="btnGroupAddon"
          />
        </InputGroup>
      </ButtonToolbar>
    </>
  )
}
