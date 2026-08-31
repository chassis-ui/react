import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CardFooter } from '../../../src/index'

describe('CardFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CardFooter className="bazinga">Test</CardFooter>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('card-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardFooter ref={ref}>Test</CardFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<CardFooter>Test</CardFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
