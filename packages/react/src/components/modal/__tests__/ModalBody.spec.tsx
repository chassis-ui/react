import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Modal } from '../../../index'

describe('Modal.Body', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Modal.Body className="bazinga">Test</Modal.Body>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('modal-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Modal.Body>Test</Modal.Body>)
      expect(container).toMatchSnapshot()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Modal.Body ref={ref}>Test</Modal.Body>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Modal.Body>Test</Modal.Body>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
