import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { ToastHeader } from '../../../src/index'
import { ToastContext } from '../../../src/components/toast/Toast'

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
