import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { NavItem } from '../../../src/index'

describe('NavItem', () => {
  describe('rendering', () => {
    test('renders a li with the base class and plain children when no href', () => {
      render(<NavItem>Test</NavItem>)
      const item = screen.getByText('Test')
      expect(item).toHaveClass('nav-item')
      expect(item.tagName).toBe('LI')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<NavItem>Test</NavItem>)
      expect(container).toMatchSnapshot()
    })

    test('wraps children in a NavLink when href is provided', () => {
      render(
        <NavItem active={true} className="bazinga" disabled={true} href="/bazinga">
          Test
        </NavItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('nav-link', 'active', 'disabled')
      expect(screen.getByRole('listitem')).toHaveClass('nav-item', 'bazinga')
    })

    test('applies the caller className only to the outer li, not the inner NavLink', () => {
      render(
        <NavItem className="bazinga" href="/bazinga">
          Test
        </NavItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      const item = screen.getByRole('listitem')
      expect(item.className.split(' ')).toContain('bazinga')
      expect(link.className.split(' ')).not.toContain('bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<NavItem ref={ref}>Test</NavItem>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <NavItem href="/bazinga">Test</NavItem>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
