import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxNavbarBrand } from '../../../index'

describe('CxNavbarBrand', () => {
  describe('rendering', () => {
    test('renders a span with the base class when no href is given', () => {
      const { container } = render(<CxNavbarBrand>Test</CxNavbarBrand>)
      expect(container.firstChild).toHaveClass('navbar-brand')
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    test('renders an anchor when href is provided', () => {
      render(<CxNavbarBrand href="/bazinga">Test</CxNavbarBrand>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('navbar-brand')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxNavbarBrand href="/bazinga">Test</CxNavbarBrand>)
      expect(container).toMatchSnapshot()
    })

    test('an explicit component takes precedence over href', () => {
      const { container } = render(
        <CxNavbarBrand className="bazinga" component="h3" href="/bazinga">
          Test
        </CxNavbarBrand>
      )
      expect(container.firstChild).toHaveClass('navbar-brand', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span by default', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<CxNavbarBrand ref={ref}>Test</CxNavbarBrand>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    test('forwards a ref to the underlying anchor when href is provided', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CxNavbarBrand ref={ref} href="/bazinga">
          Test
        </CxNavbarBrand>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations as a link', async () => {
      const { container } = render(<CxNavbarBrand href="/bazinga">Test</CxNavbarBrand>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
