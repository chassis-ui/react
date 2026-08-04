import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Subtitle', () => {
  describe('rendering', () => {
    test('renders an h6 with the base class by default', () => {
      render(<Card.Subtitle>Test</Card.Subtitle>)
      const heading = screen.getByRole('heading', { level: 6, name: 'Test' })
      expect(heading).toHaveClass('card-subtitle')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Subtitle>Test</Card.Subtitle>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Card.Subtitle className="bazinga" component="h3">
          Test
        </Card.Subtitle>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('card-subtitle', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<Card.Subtitle ref={ref}>Test</Card.Subtitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Subtitle>Test</Card.Subtitle>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
