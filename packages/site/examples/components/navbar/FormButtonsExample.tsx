import { Button, Form, Navbar } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar className="bg-even">
      <Form className="container fluid justify-content-start">
        <Button type="button" color="primary" variant="outline" className="me-small">
          Main button
        </Button>
        <Button type="button" color="secondary" variant="outline" size="small">
          Smaller button
        </Button>
        <button type="submit" hidden>
          Submit
        </button>
      </Form>
    </Navbar>
  )
}
