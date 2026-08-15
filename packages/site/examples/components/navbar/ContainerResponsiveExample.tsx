import { Container, Navbar, NavbarBrand } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar expand="large" className="bg-even">
      <Container fluidUntil="medium">
        <NavbarBrand href="#">Navbar</NavbarBrand>
      </Container>
    </Navbar>
  )
}
