import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxMenuHeader } from '../../../index'

describe('CxMenuHeader', () => {
  describe('rendering', () => {
    test('renders an h4 with the base class by default', () => {
      render(<CxMenuHeader>Test</CxMenuHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('menu-header')
      expect(header.tagName).toBe('H4')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxMenuHeader>Test</CxMenuHeader>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CxMenuHeader component="h5" className="bazinga">
          Test
        </CxMenuHeader>
      )
      const header = screen.getByText('Test')
      expect(header).toHaveClass('menu-header', 'bazinga')
      expect(header.tagName).toBe('H5')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CxMenuHeader ref={ref}>Test</CxMenuHeader>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CxMenuHeader>Test</CxMenuHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
