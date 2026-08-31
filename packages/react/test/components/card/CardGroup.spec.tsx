import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card, CardGroup } from '../../../src/index'

describe('CardGroup', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CardGroup className="bazinga">Test</CardGroup>)
      const group = screen.getByText('Test')
      expect(group).toHaveClass('card-group', 'bazinga')
      expect(group.tagName).toBe('DIV')
    })

    test('composes multiple Card children without altering their own class/tag', () => {
      render(
        <CardGroup>
          <Card>Card A</Card>
          <Card>Card B</Card>
        </CardGroup>
      )
      const cardA = screen.getByText('Card A')
      const cardB = screen.getByText('Card B')
      expect(cardA).toHaveClass('card')
      expect(cardB).toHaveClass('card')
      // eslint-disable-next-line testing-library/no-node-access
      expect(cardA.parentElement).toHaveClass('card-group')
      // eslint-disable-next-line testing-library/no-node-access
      expect(cardA.parentElement).toBe(cardB.parentElement)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardGroup ref={ref}>Test</CardGroup>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardGroup>Test</CardGroup>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
