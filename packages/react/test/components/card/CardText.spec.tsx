import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardText } from '../../../src/index'

describe('CardText', () => {
  describe('rendering', () => {
    test('renders a p with the base class by default', () => {
      render(<CardText>Test</CardText>)
      const text = screen.getByText('Test')
      expect(text).toHaveClass('card-text')
      expect(text.tagName).toBe('P')
    })

    test('renders as a custom component with className merged', () => {
      render(
        <CardText className="bazinga" component="h3">
          Test
        </CardText>
      )
      const text = screen.getByText('Test')
      expect(text).toHaveClass('card-text', 'bazinga')
      expect(text.tagName).toBe('H3')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying paragraph', () => {
      const ref = React.createRef<HTMLParagraphElement>()
      render(<CardText ref={ref}>Test</CardText>)
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardText>Test</CardText>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
