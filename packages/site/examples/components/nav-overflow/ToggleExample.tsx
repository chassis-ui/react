import { Nav, NavItem, NavOverflow } from '@chassis-ui/react'

const pages = ['Home', 'Dashboard', 'Products', 'Services', 'Analytics', 'Reports', 'Settings']

const items = pages.map((page, index) => (
  <NavItem key={page} href="#" active={index === 0}>
    {page}
  </NavItem>
))

export const Example = () => (
  <div className="vstack gap-md">
    <NavOverflow moreText="See all" iconPlacement="end">
      <Nav variant="segments">{items}</Nav>
    </NavOverflow>
    <NavOverflow moreText={false} moreLabel="More pages" moreIcon="bars-outline">
      <Nav variant="segments">{items}</Nav>
    </NavOverflow>
  </div>
)
