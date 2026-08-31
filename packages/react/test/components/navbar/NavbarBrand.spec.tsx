import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavbarBrand } from '../../../src/index'

describe('NavbarBrand', () => {
  describe('rendering', () => {
    test('renders a span with the base class when no href is given', () => {
      render(<NavbarBrand>Test</NavbarBrand>)
      const brand = screen.getByText('Test')
      expect(brand).toHaveClass('navbar-brand')
      expect(brand.tagName).toBe('SPAN')
    })

    test('renders an anchor when href is provided', () => {
      render(<NavbarBrand href="/bazinga">Test</NavbarBrand>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('navbar-brand')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('an explicit component takes precedence over href', () => {
      render(
        <NavbarBrand className="bazinga" component="h3" href="/bazinga">
          Test
        </NavbarBrand>
      )
      const brand = screen.getByText('Test')
      expect(brand).toHaveClass('navbar-brand', 'bazinga')
      expect(brand.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span by default', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<NavbarBrand ref={ref}>Test</NavbarBrand>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    test('forwards a ref to the underlying anchor when href is provided', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <NavbarBrand ref={ref} href="/bazinga">
          Test
        </NavbarBrand>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a link', async () => {
      const { container } = render(<NavbarBrand href="/bazinga">Test</NavbarBrand>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
