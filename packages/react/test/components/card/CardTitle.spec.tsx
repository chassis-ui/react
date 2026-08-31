import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardTitle } from '../../../src/index'

describe('CardTitle', () => {
  describe('rendering', () => {
    test('renders an h5 with the base class by default', () => {
      render(<CardTitle>Test</CardTitle>)
      const heading = screen.getByRole('heading', { level: 5, name: 'Test' })
      expect(heading).toHaveClass('card-title')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CardTitle className="bazinga" component="h3">
          Test
        </CardTitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('card-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CardTitle ref={ref}>Test</CardTitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardTitle>Test</CardTitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
