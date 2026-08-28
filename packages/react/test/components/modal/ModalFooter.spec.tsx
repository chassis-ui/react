import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ModalFooter } from '../../../src/index'

describe('ModalFooter', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<ModalFooter className="bazinga">Test</ModalFooter>)
      const footer = screen.getByText('Test')
      expect(footer).toHaveClass('modal-footer', 'bazinga')
      expect(footer.tagName).toBe('DIV')
    })

    test('applies the stacked class', () => {
      render(<ModalFooter stacked>Test</ModalFooter>)
      expect(screen.getByText('Test')).toHaveClass('modal-footer', 'stacked')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ModalFooter ref={ref}>Test</ModalFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ModalFooter>Test</ModalFooter>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
