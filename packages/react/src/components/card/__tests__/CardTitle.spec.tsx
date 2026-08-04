import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Title', () => {
  describe('rendering', () => {
    test('renders an h5 with the base class by default', () => {
      render(<Card.Title>Test</Card.Title>)
      const heading = screen.getByRole('heading', { level: 5, name: 'Test' })
      expect(heading).toHaveClass('card-title')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Title>Test</Card.Title>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Card.Title className="bazinga" component="h3">
          Test
        </Card.Title>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('card-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<Card.Title ref={ref}>Test</Card.Title>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Title>Test</Card.Title>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
