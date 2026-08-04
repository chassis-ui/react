import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Toast } from '../../../index'
import { ToastContext } from '../Toast'

describe('Toast.Header', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<Toast.Header className="bazinga">Test</Toast.Header>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('toast-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<Toast.Header>Test</Toast.Header>)
      expect(container).toMatchSnapshot()
    })

    test('does not render a close button by default', () => {
      render(<Toast.Header>Test</Toast.Header>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('renders a close button when closeButton is set', () => {
      render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <Toast.Header closeButton>Test</Toast.Header>
        </ToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Toast.Header ref={ref}>Test</Toast.Header>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <ToastContext.Provider value={{ setVisible: vi.fn() }}>
          <Toast.Header closeButton>Test</Toast.Header>
        </ToastContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
