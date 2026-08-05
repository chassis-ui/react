import { Nav, Menu } from '@chassis-ui/react'

export const PillsWithMenuExample = () => {
  return (
    <Nav variant="pills">
      <Nav.Item>
        <Nav.Link href="#" active>
          Active
        </Nav.Link>
      </Nav.Item>
      <Menu component="li" className="nav-item">
        <Menu.Toggle color="secondary">Menu button</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
        </Menu.List>
      </Menu>
      <Nav.Item>
        <Nav.Link href="#">Link</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" disabled>
          Disabled
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}
