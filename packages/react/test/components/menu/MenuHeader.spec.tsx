import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { MenuHeader } from '../../../src/index'

describe('MenuHeader', () => {
  describe('rendering', () => {
    test('renders an h4 with the base class by default', () => {
      render(<MenuHeader>Test</MenuHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('menu-header')
      expect(header.tagName).toBe('H4')
      expect(header).toHaveAttribute('role', 'presentation')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <MenuHeader component="h5" className="bazinga">
          Test
        </MenuHeader>
      )
      const header = screen.getByText('Test')
      expect(header).toHaveClass('menu-header', 'bazinga')
      expect(header.tagName).toBe('H5')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<MenuHeader ref={ref}>Test</MenuHeader>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<MenuHeader>Test</MenuHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
