import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavLink } from '../../../src/index'

describe('NavLink', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class by default', () => {
      render(<NavLink href="/bazinga">Test</NavLink>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('nav-link')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<NavLink href="/bazinga">Test</NavLink>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with active/disabled classes', () => {
      render(
        <NavLink active={true} className="bazinga" component="h3" disabled={true}>
          Test
        </NavLink>
      )
      const link = screen.getByText('Test')
      expect(link).toHaveClass('nav-link', 'active', 'disabled', 'bazinga')
      expect(link.tagName).toBe('H3')
    })

    test('accepts an arbitrary "to" attribute without affecting the base class', () => {
      render(<NavLink to="/bazinga">Test</NavLink>)
      expect(screen.getByText('Test')).toHaveClass('nav-link')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor by default', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <NavLink ref={ref} href="/bazinga">
          Test
        </NavLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <NavLink ref={ref} component="button">
          Test
        </NavLink>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<NavLink href="/bazinga">Test</NavLink>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
