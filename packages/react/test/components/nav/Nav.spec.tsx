import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Nav, NavItem, NavLink } from '../../../src/index'

describe('Nav', () => {
  describe('rendering', () => {
    test('renders a ul with the base class and navigation role by default', () => {
      render(<Nav>Test</Nav>)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('nav')
      expect(nav.tagName).toBe('UL')
    })

    test('renders a plain NavLink with the nav-link class', () => {
      render(
        <Nav>
          <NavItem>
            <NavLink href="#" active>
              Active
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Link</NavLink>
          </NavItem>
        </Nav>
      )
      expect(screen.getByRole('link', { name: 'Link' })).toHaveClass('nav-link')
    })

    test('renders as a custom component keeping the navigation role', () => {
      render(
        <Nav className="bazinga" component="h3" layout="justified" variant="pills">
          Test
        </Nav>
      )
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('nav', 'nav-justified', 'nav-pills', 'bazinga')
      expect(nav.tagName).toBe('H3')
    })
  })

  describe('data-driven items', () => {
    test('renders items from the items prop, ignoring children', () => {
      render(
        <Nav
          items={[
            { label: 'Home', href: '#', active: true },
            { label: 'About', href: '#' },
            { label: 'Contact', href: '#', disabled: true }
          ]}
        />
      )

      const home = screen.getByRole('link', { name: 'Home' })
      expect(home).toHaveClass('active')
      expect(home).toHaveAttribute('aria-current', 'page')

      const contact = screen.getByRole('link', { name: 'Contact' })
      expect(contact).toHaveClass('disabled')
      expect(contact).toHaveAttribute('aria-disabled', 'true')
      expect(contact).toHaveAttribute('tabIndex', '-1')
    })

    // Regression test for a bug where an omitted href (a valid, optional field on
    // NavItemDef) still rendered a real, clickable `<a href="#">` - a dead link. The items path
    // now delegates to NavItem, which already falls back to plain (non-anchor) markup, matching
    // Breadcrumb/Stepper's own equivalent fallback.
    test('an item without href renders as plain text, not a dead link', () => {
      render(<Nav items={[{ label: 'Plain' }]} />)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      const item = screen.getByText('Plain')
      expect(item.tagName).toBe('LI')
      expect(item).toHaveClass('nav-item')
    })

    test('the items path renders the same markup as composing NavItem/NavLink directly', () => {
      const { container: viaItems } = render(
        <Nav items={[{ label: 'Home', href: '#', active: true }]} />
      )
      const { container: viaComposition } = render(
        <Nav>
          <NavItem>
            <NavLink href="#" active>
              Home
            </NavLink>
          </NavItem>
        </Nav>
      )
      expect(viaItems.innerHTML).toBe(viaComposition.innerHTML)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying ul', () => {
      const ref = React.createRef<HTMLUListElement>()
      render(<Nav ref={ref}>Test</Nav>)
      expect(ref.current).toBeInstanceOf(HTMLUListElement)
    })
  })

  describe('accessibility', () => {
    // The default `ul` root keeps the hardcoded `role="navigation"` from the component, which
    // axe flags as an invalid landmark-on-list role (aria-allowed-role) — a pre-existing issue,
    // not something to paper over here. `<li>` children also require a `<ul>/<ol>` ancestor to
    // carry a valid listitem role, so this check renders as `nav` with non-list content to
    // validate Nav's own contributed markup without tripping over that known default-mode gap.
    test('has no axe violations', async () => {
      const { container } = render(
        <Nav component="nav">
          <NavLink href="#" active>
            Active
          </NavLink>
          <NavLink href="#">Link</NavLink>
        </Nav>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
