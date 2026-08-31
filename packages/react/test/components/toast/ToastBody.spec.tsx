import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ToastBody } from '../../../src/index'
import { ToastContext } from '../../../src/components/toast/context'

describe('ToastBody', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<ToastBody className="bazinga">Test</ToastBody>)
      const body = screen.getByText('Test')
      expect(body).toHaveClass('toast-body', 'bazinga')
      expect(body.tagName).toBe('DIV')
    })

    test('does not render a close button by default', () => {
      render(<ToastBody>Test</ToastBody>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('renders a close button when closeButton is set', () => {
      render(
        <ToastContext.Provider value={{ close: vi.fn() }}>
          <ToastBody closeButton>Test</ToastBody>
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('shorthand props', () => {
    test('closeLabel overrides the close button accessible name', () => {
      render(
        <ToastContext.Provider value={{ close: vi.fn() }}>
          <ToastBody closeButton closeLabel="Fermer">
            Test
          </ToastBody>
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    })

    test('clicking the close button calls close from context', () => {
      const close = vi.fn()
      render(
        <ToastContext.Provider value={{ close }}>
          <ToastBody closeButton>Test</ToastBody>
        </ToastContext.Provider>
      )
      fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(close).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ToastBody ref={ref}>Test</ToastBody>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(<ToastBody>Test</ToastBody>)
      expect(await axe(container)).toHaveNoViolations()
    })

    test('has no axe violations with closeButton', async () => {
      const { container } = render(
        <ToastContext.Provider value={{ close: vi.fn() }}>
          <ToastBody closeButton>Test</ToastBody>
        </ToastContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
