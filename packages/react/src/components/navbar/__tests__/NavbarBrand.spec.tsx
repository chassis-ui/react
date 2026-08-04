import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Navbar } from '../../../index'

describe('Navbar.Brand', () => {
  describe('rendering', () => {
    test('renders a span with the base class when no href is given', () => {
      render(<Navbar.Brand>Test</Navbar.Brand>)
      const brand = screen.getByText('Test')
      expect(brand).toHaveClass('navbar-brand')
      expect(brand.tagName).toBe('SPAN')
    })

    test('renders an anchor when href is provided', () => {
      render(<Navbar.Brand href="/bazinga">Test</Navbar.Brand>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('navbar-brand')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Navbar.Brand href="/bazinga">Test</Navbar.Brand>)
      expect(container).toMatchSnapshot()
    })

    test('an explicit component takes precedence over href', () => {
      render(
        <Navbar.Brand className="bazinga" component="h3" href="/bazinga">
          Test
        </Navbar.Brand>
      )
      const brand = screen.getByText('Test')
      expect(brand).toHaveClass('navbar-brand', 'bazinga')
      expect(brand.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span by default', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Navbar.Brand ref={ref}>Test</Navbar.Brand>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    test('forwards a ref to the underlying anchor when href is provided', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Navbar.Brand ref={ref} href="/bazinga">
          Test
        </Navbar.Brand>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a link', async () => {
      const { container } = render(<Navbar.Brand href="/bazinga">Test</Navbar.Brand>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
