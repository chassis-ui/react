import { Container, Navbar, NavbarText } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar className="bg-even">
      <Container fluid>
        <NavbarText>Navbar text with an inline element</NavbarText>
      </Container>
    </Navbar>
  )
}
