import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Nav } from '../../../index'

describe('Nav.Item', () => {
  describe('rendering', () => {
    test('renders a li with the base class and plain children when no href', () => {
      render(<Nav.Item>Test</Nav.Item>)
      const item = screen.getByText('Test')
      expect(item).toHaveClass('nav-item')
      expect(item.tagName).toBe('LI')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Nav.Item>Test</Nav.Item>)
      expect(container).toMatchSnapshot()
    })

    test('wraps children in a Nav.Link when href is provided', () => {
      render(
        <Nav.Item active={true} className="bazinga" disabled={true} href="/bazinga">
          Test
        </Nav.Item>
      )
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('nav-link', 'active', 'disabled')
      expect(screen.getByRole('listitem')).toHaveClass('nav-item', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<Nav.Item ref={ref}>Test</Nav.Item>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <Nav.Item href="/bazinga">Test</Nav.Item>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
