import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Modal } from '../../../index'

describe('Modal.Title', () => {
  describe('rendering', () => {
    test('renders an h2 with the base class by default', () => {
      render(<Modal.Title>Test</Modal.Title>)
      const heading = screen.getByRole('heading', { level: 2, name: 'Test' })
      expect(heading).toHaveClass('modal-title')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Modal.Title>Test</Modal.Title>)
      expect(container).toMatchSnapshot()
    })

    test('renders as a custom component with className merged', () => {
      render(
        <Modal.Title className="bazinga" component="h3">
          Test
        </Modal.Title>
      )
      const heading = screen.getByRole('heading', { level: 3, name: 'Test' })
      expect(heading).toHaveClass('modal-title', 'bazinga')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying heading', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<Modal.Title ref={ref}>Test</Modal.Title>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Modal.Title>Test</Modal.Title>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
