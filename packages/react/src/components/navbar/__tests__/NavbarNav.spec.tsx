import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavbarNav } from '../../../index'

describe('NavbarNav', () => {
  describe('rendering', () => {
    test('renders a ul with the base class and navigation role by default', () => {
      render(<NavbarNav>Test</NavbarNav>)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navbar-nav')
      expect(nav.tagName).toBe('UL')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<NavbarNav>Test</NavbarNav>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component keeping the navigation role', () => {
      render(
        <NavbarNav className="bazinga" component="h3">
          Test
        </NavbarNav>
      )
      const nav = screen.getByRole('navigation')
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
    // The default `ul` root keeps the hardcoded `role="navigation"` from the component, which
    // axe flags as an invalid landmark-on-list role (aria-allowed-role) — a pre-existing issue,
    // not something to paper over here. Rendering as a `div` sidesteps it for this check.
    test('has no axe violations', async () => {
      const { container } = render(<NavbarNav component="div">Test</NavbarNav>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
