import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavbarNav } from '../../../src/index'

describe('NavbarNav', () => {
  describe('rendering', () => {
    test('renders a ul with the base class', () => {
      render(<NavbarNav>Test</NavbarNav>)
      const nav = screen.getByRole('list')
      expect(nav).toHaveClass('navbar-nav')
      expect(nav.tagName).toBe('UL')
    })

    test('renders as a custom component', () => {
      render(
        <NavbarNav className="bazinga" component="h3">
          Test
        </NavbarNav>
      )
      const nav = screen.getByText('Test')
      expect(nav).toHaveClass('navbar-nav', 'bazinga')
      expect(nav.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying ul', () => {
      const ref = React.createRef<HTMLUListElement>()
      render(<NavbarNav ref={ref}>Test</NavbarNav>)
      expect(ref.current).toBeInstanceOf(HTMLUListElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <NavbarNav>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Home
            </a>
          </li>
        </NavbarNav>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
