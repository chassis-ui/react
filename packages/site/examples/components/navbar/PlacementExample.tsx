import { Container, Navbar, NavbarBrand } from '@chassis-ui/react'

export const PlacementExample = () => {
  return (
    <div className="d-flex flex-column gap-small">
      <Navbar className="bg-even" placement="fixed-top">
        <Container fluid>
          <NavbarBrand href="#">Fixed top</NavbarBrand>
        </Container>
      </Navbar>
      <Navbar className="bg-even" placement="fixed-bottom">
        <Container fluid>
          <NavbarBrand href="#">Fixed bottom</NavbarBrand>
        </Container>
      </Navbar>
      <Navbar className="bg-even" placement="sticky-top">
        <Container fluid>
          <NavbarBrand href="#">Sticky top</NavbarBrand>
        </Container>
      </Navbar>
      <Navbar className="bg-even" placement="sticky-bottom">
        <Container fluid>
          <NavbarBrand href="#">Sticky bottom</NavbarBrand>
        </Container>
      </Navbar>
    </div>
  )
}
