import { Container, Navbar, NavbarBrand } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Navbar expand="lg" className="bg-even">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
        </Container>
      </Navbar>
    </Container>
  )
}
