import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Text', () => {
  describe('rendering', () => {
    test('renders a p with the base class by default', () => {
      render(<Card.Text>Test</Card.Text>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('card-text')
      expect(text.tagName).toBe('P')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Text>Test</Card.Text>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Card.Text className="bazinga" component="h3">
          Test
        </Card.Text>
      )
      const text = screen.getByText('Test')
      expect(text).toHaveClass('card-text', 'bazinga')
      expect(text.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying paragraph', () => {
      const ref = React.createRef<HTMLParagraphElement>()
      render(<Card.Text ref={ref}>Test</Card.Text>)
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Text>Test</Card.Text>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
