import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Navbar } from '../../../index'

describe('Navbar.Text', () => {
  describe('rendering', () => {
    test('renders a span with the base class and className merged', () => {
      render(<Navbar.Text className="bazinga">Test</Navbar.Text>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('navbar-text', 'bazinga')
      expect(text.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Navbar.Text>Test</Navbar.Text>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Navbar.Text ref={ref}>Test</Navbar.Text>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Navbar.Text>Test</Navbar.Text>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
