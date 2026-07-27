import * as React from 'react'
import { render } from '@testing-library/react'

import {
  CxNav,
  CxNavItem,
  CxNavLink,
  CxMenu,
  CxMenuToggle,
  CxMenuList,
  CxMenuItem
} from '../../../index'

test('loads and displays CxNav component', async () => {
  const { container } = render(<CxNav>Test</CxNav>)
  expect(container).toMatchSnapshot()
})

test('CxNav customize', async () => {
  const { container } = render(
    <CxNav className="bazinga" component="h3" layout="justified" variant="pills">
      Test
    </CxNav>
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
      <CxMenu component="li" className="nav-item">
        <CxMenuToggle>A</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">B</CxMenuItem>
          <CxMenuItem href="#">C</CxMenuItem>
          <CxMenuItem href="#">D</CxMenuItem>
        </CxMenuList>
      </CxMenu>
      <CxNavItem>
        <CxNavLink href="#">Link</CxNavLink>
      </CxNavItem>
      <CxNavItem>
        <CxNavLink href="#" disabled>
          Disabled
        </CxNavLink>
      </CxNavItem>
    </CxNav>
  )
  expect(container).toMatchSnapshot()
})
