import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.Footer', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Card.Footer className="bazinga">Test</Card.Footer>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('card-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.Footer>Test</Card.Footer>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card.Footer ref={ref}>Test</Card.Footer>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.Footer>Test</Card.Footer>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
