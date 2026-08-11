import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ToastHeader } from '../../../src/index'
import { ToastContext } from '../../../src/components/toast/context'

describe('ToastHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      const { container } = render(<ToastHeader className="bazinga">Test</ToastHeader>)
      const header = container.firstElementChild
      expect(header).toHaveClass('toast-header', 'bazinga')
      expect(header?.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<ToastHeader>Test</ToastHeader>)
      expect(container).toMatchSnapshot()
    })

    test('does not render a close button by default', () => {
      render(<ToastHeader>Test</ToastHeader>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('renders a close button when closeButton is set', () => {
      render(
        <ToastContext.Provider value={{ close: vi.fn() }}>
          <ToastHeader closeButton>Test</ToastHeader>
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('shorthand props', () => {
    test('renders icon, children as the heading, and time in that order', () => {
      render(
        <ToastHeader icon={<svg data-testid="logo" />} time="7 min ago">
          Chassis
        </ToastHeader>
      )
      expect(screen.getByTestId('logo')).toBeInTheDocument()
      const title = screen.getByText('Chassis')
      expect(title.tagName).toBe('STRONG')
      expect(title).toHaveClass('me-auto')
      expect(screen.getByText('7 min ago').tagName).toBe('SMALL')
    })

    test('renders a string icon via ToastIcon', () => {
      render(<ToastHeader icon="check-solid">Chassis</ToastHeader>)
      expect(document.querySelector('.toast-icon')).toBeInTheDocument()
    })

    test('hides icon from assistive technology by default', () => {
      render(<ToastHeader icon={<svg data-testid="logo" />}>Chassis</ToastHeader>)
      expect(screen.getByTestId('logo').parentElement).toHaveAttribute('aria-hidden', 'true')
    })

    test('sets the title id when titleId is passed, for aria-labelledby wiring', () => {
      render(<ToastHeader titleId="custom-title-id">Chassis</ToastHeader>)
      expect(screen.getByText('Chassis')).toHaveAttribute('id', 'custom-title-id')
    })

    test('closeLabel overrides the close button accessible name', () => {
      render(
        <ToastContext.Provider value={{ close: vi.fn() }}>
          <ToastHeader closeButton closeLabel="Fermer" />
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<ToastHeader ref={ref}>Test</ToastHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ToastContext.Provider value={{ close: vi.fn() }}>
          <ToastHeader closeButton>Test</ToastHeader>
        </ToastContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
