import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ToastHeader } from '../../../src/index'
import { ToastContext } from '../../../src/components/toast/context'

describe('ToastHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<ToastHeader className="bazinga">Test</ToastHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('toast-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
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
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastHeader closeButton>Test</ToastHeader>
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('shorthand props', () => {
    test('renders image, title and time in the same order as manual composition', () => {
      render(
        <ToastHeader image={<svg data-testid="logo" />} title="Chassis" time="7 min ago" />
      )
      expect(screen.getByTestId('logo')).toBeInTheDocument()
      const title = screen.getByText('Chassis')
      expect(title.tagName).toBe('STRONG')
      expect(title).toHaveClass('me-auto')
      expect(screen.getByText('7 min ago').tagName).toBe('SMALL')
    })

    test('hides image from assistive technology by default', () => {
      render(<ToastHeader image={<svg data-testid="logo" />} title="Chassis" />)
      expect(screen.getByTestId('logo').parentElement).toHaveAttribute('aria-hidden', 'true')
    })

    test('sets the title id when titleId is passed, for aria-labelledby wiring', () => {
      render(<ToastHeader title="Chassis" titleId="custom-title-id" />)
      expect(screen.getByText('Chassis')).toHaveAttribute('id', 'custom-title-id')
    })

    test('closeLabel overrides the close button accessible name', () => {
      render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastHeader closeButton closeLabel="Fermer" />
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    })

    test('renders shorthand props and children together, children in between time and the close button', () => {
      render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastHeader title="Chassis" closeButton>
            <span data-testid="extra">Extra</span>
          </ToastHeader>
        </ToastContext.Provider>
      )
      expect(screen.getByText('Chassis')).toBeInTheDocument()
      expect(screen.getByTestId('extra')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
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
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <ToastHeader closeButton>Test</ToastHeader>
        </ToastContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
