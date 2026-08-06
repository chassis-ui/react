import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../src/index'

describe('Card', () => {
  describe('rendering', () => {
    test('renders a div with the base class', () => {
      render(<Card>Test</Card>)
      const card = screen.getByText('Test')
      expect(card).toHaveClass('card')
      expect(card.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card>Test</Card>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('styling props', () => {
    test('applies color, textColor and className together', () => {
      render(
        <Card className="bazinga" color="primary" textColor="warning">
          Test
        </Card>
      )
      expect(screen.getByText('Test')).toHaveClass('card', 'bg-primary', 'fg-warning', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card ref={ref}>Test</Card>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card>Test</Card>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
