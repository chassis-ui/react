import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Menu } from '../../../index'

describe('Menu.Text', () => {
  describe('rendering', () => {
    test('renders a span with the base class by default', () => {
      render(<Menu.Text>Test</Menu.Text>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('menu-text')
      expect(text.tagName).toBe('SPAN')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Menu.Text>Test</Menu.Text>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Menu.Text component="p" className="bazinga">
          Test
        </Menu.Text>
      )
      const text = screen.getByText('Test')
      expect(text).toHaveClass('menu-text', 'bazinga')
      expect(text.tagName).toBe('P')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying span', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Menu.Text ref={ref}>Test</Menu.Text>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Menu.Text>Test</Menu.Text>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
