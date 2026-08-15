import { Container, Navbar, NavbarBrand } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
      </Container>
    </Navbar>
  )
}
