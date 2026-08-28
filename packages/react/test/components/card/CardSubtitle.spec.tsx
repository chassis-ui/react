import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardSubtitle } from '../../../src/index'

describe('CardSubtitle', () => {
  describe('rendering', () => {
    test('renders an h6 with the base class by default', () => {
      render(<CardSubtitle>Test</CardSubtitle>)
      const heading = screen.getByRole('heading', { level: 6, name: 'Test' })
      expect(heading).toHaveClass('card-subtitle')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CardSubtitle className="bazinga" component="h3">
          Test
        </CardSubtitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('card-subtitle', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CardSubtitle ref={ref}>Test</CardSubtitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardSubtitle>Test</CardSubtitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
