import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Nav,
  NavItem,
  NavLink
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card className="text-center">
      <CardHeader>
        <Nav variant="tabs" className="card-header-tabs">
          <NavItem>
            <NavLink href="#" active>
              Active
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" disabled>
              Disabled
            </NavLink>
          </NavItem>
        </Nav>
      </CardHeader>
      <CardBody>
        <CardTitle>Special title treatment</CardTitle>
        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        <Button href="#">Go somewhere</Button>
      </CardBody>
    </Card>
  )
}
