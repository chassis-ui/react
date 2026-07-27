import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxNavItem } from '../../../index'

describe('CxNavItem', () => {
  describe('rendering', () => {
    test('renders a li with the base class and plain children when no href', () => {
      const { container } = render(<CxNavItem>Test</CxNavItem>)
      expect(container.firstChild).toHaveClass('nav-item')
      expect(container.firstChild?.nodeName).toBe('LI')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxNavItem>Test</CxNavItem>)
      expect(container).toMatchSnapshot()
    })

    test('wraps children in a CxNavLink when href is provided', () => {
      render(
        <CxNavItem active={true} className="bazinga" disabled={true} href="/bazinga">
          Test
        </CxNavItem>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('nav-link', 'active', 'disabled')
      expect(link.closest('li')).toHaveClass('nav-item', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<CxNavItem ref={ref}>Test</CxNavItem>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <CxNavItem href="/bazinga">Test</CxNavItem>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
