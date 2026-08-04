import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Header', () => {
  describe('rendering', () => {
    test('renders a div with the base class by default', () => {
      render(<Card.Header>Test</Card.Header>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('card-header')
      expect(header.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Header>Test</Card.Header>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Card.Header className="bazinga" component="h3">
          Test
        </Card.Header>
      )
      const header = screen.getByText('Test')
      expect(header).toHaveClass('card-header', 'bazinga')
      expect(header.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card.Header ref={ref}>Test</Card.Header>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Header>Test</Card.Header>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
