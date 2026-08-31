import { Container, Navbar, NavbarBrand } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">
          <img
            src="https://placehold.co/24"
            alt=""
            width="24"
            height="24"
            className="d-inline-block align-text-top"
          />
          <span className="ms-xsmall font-strong">Chassis</span>
        </NavbarBrand>
      </Container>
    </Navbar>
  )
}
