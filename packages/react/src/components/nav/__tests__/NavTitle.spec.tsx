import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Nav } from '../../../index'

describe('Nav.Title', () => {
  describe('rendering', () => {
    test('renders a li with the base class and className merged', () => {
      render(<Nav.Title className="bazinga">Test</Nav.Title>)
      const title = screen.getByText('Test')
      expect(title).toHaveClass('nav-title', 'bazinga')
      expect(title.tagName).toBe('LI')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Nav.Title>Test</Nav.Title>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying li', () => {
      const ref = React.createRef<HTMLLIElement>()
      render(<Nav.Title ref={ref}>Test</Nav.Title>)
      expect(ref.current).toBeInstanceOf(HTMLLIElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ul>
          <Nav.Title>Test</Nav.Title>
        </ul>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
