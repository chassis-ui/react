import { Container, Navbar, NavbarBrand } from '@chassis-ui/react'

export const ContainerWrapExample = () => {
  return (
    <Container>
      <Navbar expand="large" className="bg-even">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
        </Container>
      </Navbar>
    </Container>
  )
}
