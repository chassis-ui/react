import { Nav, CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const TabsWithMenuExample = () => {
  return (
    <Nav>
      <Nav.Item>
        <Nav.Link href="#" active>
          Active
        </Nav.Link>
      </Nav.Item>
      <CxMenu component="li" className="nav-item">
        <CxMenuToggle color="secondary">Menu button</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Action</CxMenuItem>
          <CxMenuItem href="#">Another action</CxMenuItem>
          <CxMenuItem href="#">Something else here</CxMenuItem>
        </CxMenuList>
      </CxMenu>
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
