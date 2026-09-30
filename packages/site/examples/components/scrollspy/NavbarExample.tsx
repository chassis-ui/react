import { useRef } from 'react'
import {
  Container,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuToggle,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavItem,
  NavLink,
  Scrollspy
} from '@chassis-ui/react'

const text =
  'This is some placeholder content for the scrollspy example. As the box scrolls, the link to ' +
  'the section being read is marked. It is repeated in every section, to give the box enough ' +
  'to scroll.'

const sections = ['First', 'Second', 'Third', 'Fourth', 'Fifth']

export const Example = () => {
  const box = useRef<HTMLDivElement>(null)
  return (
    <>
      <Navbar expand className="bg-evident px-md mb-md rounded-sm" aria-label="Scrollspy example">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <Scrollspy root={box} rootMargin="0px 0px -40%" smoothScroll>
            <NavbarNav>
              <NavItem href="#navbar-first">First</NavItem>
              <NavItem href="#navbar-second">Second</NavItem>
              <Menu component="li" className="nav-item">
                <MenuToggle component={NavLink}>More</MenuToggle>
                <MenuList>
                  <MenuItem href="#navbar-third">Third</MenuItem>
                  <MenuItem href="#navbar-fourth">Fourth</MenuItem>
                  <MenuDivider />
                  <MenuItem href="#navbar-fifth">Fifth</MenuItem>
                </MenuList>
              </Menu>
            </NavbarNav>
          </Scrollspy>
        </Container>
      </Navbar>
      <div
        ref={box}
        role="region"
        aria-label="Sections"
        tabIndex={0}
        className="bg-evident p-md rounded-sm"
        style={{ height: 200, overflowY: 'auto', position: 'relative' }}
      >
        {sections.map((title) => (
          <div key={title}>
            <h4 id={`navbar-${title.toLowerCase()}`}>{title} heading</h4>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </>
  )
}
