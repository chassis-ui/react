import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Toast } from '../../../index'

describe('Toast.Footer', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Toast.Footer className="bazinga">Test</Toast.Footer>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('toast-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Toast.Footer>Test</Toast.Footer>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Toast.Footer ref={ref}>Test</Toast.Footer>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Toast.Footer>Test</Toast.Footer>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
