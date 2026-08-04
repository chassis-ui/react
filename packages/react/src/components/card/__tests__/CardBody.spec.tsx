import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Body', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Card.Body className="bazinga">Test</Card.Body>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('card-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Body>Test</Card.Body>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card.Body ref={ref}>Test</Card.Body>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Body>Test</Card.Body>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
