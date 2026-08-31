import { Button, Form, InputGroup, InputGroupAddon, Navbar, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar className="bg-even">
      <Form className="container fluid">
        <InputGroup>
          <InputGroupAddon id="basic-addon1">@</InputGroupAddon>
          <TextInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
          <Button type="submit" color="primary">
            Submit
          </Button>
        </InputGroup>
      </Form>
    </Navbar>
  )
}
