import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardHeader } from '../../../src/index'

describe('CardHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<CardHeader>Test</CardHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('card-header')
      expect(header.tagName).toBe('DIV')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CardHeader className="bazinga" component="h3">
          Test
        </CardHeader>
      )
      const header = screen.getByText('Test')
      expect(header).toHaveClass('card-header', 'bazinga')
      expect(header.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardHeader ref={ref}>Test</CardHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardHeader>Test</CardHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
