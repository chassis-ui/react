import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardImageOverlay } from '../../../src/index'

describe('CardImageOverlay', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CardImageOverlay className="bazinga">Test</CardImageOverlay>)
      expect(screen.getByText('Test')).toHaveClass('card-overlay', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardImageOverlay ref={ref}>Test</CardImageOverlay>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardImageOverlay>Test</CardImageOverlay>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
