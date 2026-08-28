import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { ModalContext } from '../../../src/components/modal/Modal'
import { ModalHeader } from '../../../src/index'

describe('ModalHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<ModalHeader className="bazinga">Test</ModalHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('modal-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
    })

    test('renders a close button by default', () => {
      render(<ModalHeader>Test</ModalHeader>)
      const closeButton = screen.getByRole('button', { name: 'Close' })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveClass('close-button')
      expect(closeButton).toHaveAttribute('type', 'button')
    })

    test('can hide the close button', () => {
      render(<ModalHeader closeButton={false}>Test</ModalHeader>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('closeLabel overrides the close button accessible name', () => {
      render(<ModalHeader closeLabel="Fermer">Test</ModalHeader>)
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    test('calls close from context when the close button is clicked', async () => {
      const user = userEvent.setup()
      const close = vi.fn()
      render(
        <ModalContext.Provider value={{ close }}>
          <ModalHeader>Test</ModalHeader>
        </ModalContext.Provider>
      )
      await user.click(screen.getByRole('button', { name: 'Close' }))
      expect(close).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ModalHeader ref={ref}>Test</ModalHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ModalHeader>Test</ModalHeader>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
