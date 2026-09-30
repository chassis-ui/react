import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Nav, NavItem, NavLink } from '../../../src/index'

describe('Nav', () => {
  describe('rendering', () => {
    // A `navigation` role on the `<ul>` took away its list semantics (F10 of AUDIT-PLAN.md). The
    // landmark is the caller's `<nav>` around it.
    test('renders a ul with the base class and no role of its own', () => {
      render(<Nav>Test</Nav>)
      const nav = screen.getByRole('list')
      expect(nav).toHaveClass('nav')
      expect(nav.tagName).toBe('UL')
      expect(nav).not.toHaveAttribute('role')
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

    test('renders as a custom component', () => {
      render(
        <Nav className="bazinga" component="nav" layout="justified" variant="pills">
          Test
        </Nav>
      )
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('nav', 'nav-justified', 'nav-pills', 'bazinga')
      expect(nav.tagName).toBe('NAV')
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
    test('has no axe violations as a list inside a nav landmark', async () => {
      const { container } = render(
        <nav aria-label="Sections">
          <Nav>
            <NavItem href="#" active>
              Active
            </NavItem>
            <NavItem href="#">Link</NavItem>
          </Nav>
        </nav>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations as a nav of links', async () => {
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
