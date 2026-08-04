import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { ModalContext } from '../Modal'
import { Modal } from '../../../index'

describe('Modal.Header', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Modal.Header className="bazinga">Test</Modal.Header>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('modal-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Modal.Header>Test</Modal.Header>)
      expect(container).toMatchSnapshot()
    })

    test('renders a close button by default', () => {
      render(<Modal.Header>Test</Modal.Header>)
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    test('can hide the close button', () => {
      render(<Modal.Header closeButton={false}>Test</Modal.Header>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    test('calls requestClose from context when the close button is clicked', async () => {
      const user = userEvent.setup()
      const requestClose = vi.fn()
      render(
        <ModalContext.Provider value={{ requestClose }}>
          <Modal.Header>Test</Modal.Header>
        </ModalContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(requestClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Modal.Header ref={ref}>Test</Modal.Header>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<Modal.Header>Test</Modal.Header>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
