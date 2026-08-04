import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Modal } from '../../../index'

describe('Modal.Footer', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Modal.Footer className="bazinga">Test</Modal.Footer>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('modal-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Modal.Footer>Test</Modal.Footer>)
      expect(container).toMatchSnapshot()
    })

    test('applies the stacked class', () => {
      render(<Modal.Footer stacked>Test</Modal.Footer>)
      expect(screen.getByText('Test')).toHaveClass('modal-footer', 'stacked')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Modal.Footer ref={ref}>Test</Modal.Footer>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Modal.Footer>Test</Modal.Footer>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
