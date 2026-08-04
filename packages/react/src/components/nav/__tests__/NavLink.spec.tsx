import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Nav } from '../../../index'

describe('Nav.Link', () => {
  describe('rendering', () => {
    test('renders an anchor with the base class by default', () => {
      render(<Nav.Link href="/bazinga">Test</Nav.Link>)
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveClass('nav-link')
      expect(link).toHaveAttribute('href', '/bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Nav.Link href="/bazinga">Test</Nav.Link>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with active/disabled classes', () => {
      render(
        <Nav.Link active={true} className="bazinga" component="h3" disabled={true}>
          Test
        </Nav.Link>
      )
      const link = screen.getByText('Test')
      expect(link).toHaveClass('nav-link', 'active', 'disabled', 'bazinga')
      expect(link.tagName).toBe('H3')
    })

    test('accepts an arbitrary "to" attribute without affecting the base class', () => {
      render(<Nav.Link to="/bazinga">Test</Nav.Link>)
      expect(screen.getByText('Test')).toHaveClass('nav-link')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying anchor by default', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <Nav.Link ref={ref} href="/bazinga">
          Test
        </Nav.Link>
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    test('forwards a ref to the underlying button', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <Nav.Link ref={ref} component="button">
          Test
        </Nav.Link>
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Nav.Link href="/bazinga">Test</Nav.Link>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
