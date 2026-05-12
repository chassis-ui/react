import * as React from 'react'
import { render } from '@testing-library/react'

import {
  CxNav,
  CxNavItem,
  CxNavLink,
  CxDropdown,
  CxDropdownToggle,
  CxDropdownMenu,
  CxDropdownItem,
} from '../../../index'

test('loads and displays CxNav component', async () => {
  const { container } = render(<CxNav>Test</CxNav>)
  expect(container).toMatchSnapshot()
})

test('CxNav customize', async () => {
  const { container } = render(
    <CxNav className="bazinga" component="h3" layout="justified" variant="pills">
      Test
    </CxNav>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('nav')
  expect(container.firstChild).toHaveClass('nav-justified')
  expect(container.firstChild).toHaveClass('nav-pills')
  expect(container.firstChild).toHaveClass('bazinga')
})

test('CxNav example', async () => {
  const { container } = render(
    <CxNav>
      <CxNavItem>
        <CxNavLink href="#" active>
          Active
        </CxNavLink>
      </CxNavItem>
      <CxNavItem>
        <CxNavLink href="#">Link</CxNavLink>
      </CxNavItem>
      <CxDropdown variant="nav-item">
        <CxDropdownToggle>A</CxDropdownToggle>
        <CxDropdownMenu>
          <CxDropdownItem href="#">B</CxDropdownItem>
          <CxDropdownItem href="#">C</CxDropdownItem>
          <CxDropdownItem href="#">D</CxDropdownItem>
        </CxDropdownMenu>
      </CxDropdown>
      <CxNavItem>
        <CxNavLink href="#">Link</CxNavLink>
      </CxNavItem>
      <CxNavItem>
        <CxNavLink href="#" disabled>
          Disabled
        </CxNavLink>
      </CxNavItem>
    </CxNav>,
  )
  expect(container).toMatchSnapshot()
})
