import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Card } from '../../../index'

describe('Card.ImageOverlay', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Card.ImageOverlay className="bazinga">Test</Card.ImageOverlay>)
      expect(screen.getByText('Test')).toHaveClass('card-overlay', 'bazinga')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Card.ImageOverlay>Test</Card.ImageOverlay>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card.ImageOverlay ref={ref}>Test</Card.ImageOverlay>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Card.ImageOverlay>Test</Card.ImageOverlay>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
