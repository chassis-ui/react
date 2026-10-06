import { useState } from 'react'
import { Nav, NavItem, NavOverflow } from '@chassis-ui/react'

export const Example = () => {
  const [counts, setCounts] = useState({ overflowCount: 0, visibleCount: 6 })
  return (
    <>
      <NavOverflow collapseBelow="sm" onOverflow={setCounts}>
        <Nav variant="segments">
          <NavItem href="#" active>
            Home
          </NavItem>
          <NavItem href="#">Dashboard</NavItem>
          <NavItem href="#">Products</NavItem>
          <NavItem href="#">Services</NavItem>
          <NavItem href="#">Analytics</NavItem>
          <NavItem href="#">Reports</NavItem>
        </Nav>
      </NavOverflow>
      <p className="mt-md mb-0">
        {counts.visibleCount} in the list, {counts.overflowCount} in the menu.
      </p>
    </>
  )
}
