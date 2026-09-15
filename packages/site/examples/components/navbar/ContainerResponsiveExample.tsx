import { Container, Navbar, NavbarBrand } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar expand="lg" className="bg-even">
      <Container fluidUntil="md">
        <NavbarBrand href="#">Navbar</NavbarBrand>
      </Container>
    </Navbar>
  )
}
