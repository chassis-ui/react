import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Menu } from '../../../index'

describe('Menu.Header', () => {
  describe('rendering', () => {
    test('renders an h4 with the base class by default', () => {
      render(<Menu.Header>Test</Menu.Header>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('menu-header')
      expect(header.tagName).toBe('H4')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Menu.Header>Test</Menu.Header>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Menu.Header component="h5" className="bazinga">
          Test
        </Menu.Header>
      )
      const header = screen.getByText('Test')
      expect(header).toHaveClass('menu-header', 'bazinga')
      expect(header.tagName).toBe('H5')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<Menu.Header ref={ref}>Test</Menu.Header>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Menu.Header>Test</Menu.Header>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
