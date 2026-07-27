import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxNavLink } from '../../../index'

describe('CxNavLink', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class by default', () => {
      render(<CxNavLink href="/bazinga">Test</CxNavLink>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('nav-link')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxNavLink href="/bazinga">Test</CxNavLink>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with active/disabled classes', () => {
      const { container } = render(
        <CxNavLink active={true} className="bazinga" component="h3" disabled={true}>
          Test
        </CxNavLink>
      )
      expect(container.firstChild).toHaveClass('nav-link', 'active', 'disabled', 'bazinga')
      expect(container.firstChild?.nodeName).toBe('H3')
    })

    test('accepts an arbitrary "to" attribute without affecting the base class', () => {
      const { container } = render(<CxNavLink to="/bazinga">Test</CxNavLink>)
      expect(container.firstChild).toHaveClass('nav-link')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor by default', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CxNavLink ref={ref} href="/bazinga">
          Test
        </CxNavLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <CxNavLink ref={ref} component="button">
          Test
        </CxNavLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxNavLink href="/bazinga">Test</CxNavLink>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
