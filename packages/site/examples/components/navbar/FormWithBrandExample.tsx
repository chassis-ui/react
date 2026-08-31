import { Button, Container, Form, Navbar, NavbarBrand, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
        <Form className="d-flex" role="search">
          <TextInput type="search" className="me-small" placeholder="Search" aria-label="Search" />
          <Button type="submit" color="primary" variant="outline">
            Search
          </Button>
        </Form>
      </Container>
    </Navbar>
  )
}
