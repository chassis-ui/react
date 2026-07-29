import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxToastHeader } from '../../../index'
import { CxToastContext } from '../CxToast'

describe('CxToastHeader', () => {
  describe('rendering', () => {
    test('renders a div with the base class and className merged', () => {
      render(<CxToastHeader className="bazinga">Test</CxToastHeader>)
      const header = screen.getByText('Test')
      expect(header).toHaveClass('toast-header', 'bazinga')
      expect(header.tagName).toBe('DIV')
    })

    test('matches the baseline markup snapshot', () => {
      const { container } = render(<CxToastHeader>Test</CxToastHeader>)
      expect(container).toMatchSnapshot()
    })

    test('does not render a close button by default', () => {
      render(<CxToastHeader>Test</CxToastHeader>)
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    })

    test('renders a close button when closeButton is set', () => {
      render(
        <CxToastContext.Provider value={{ setVisible: vi.fn() }}>
          <CxToastHeader closeButton>Test</CxToastHeader>
        </CxToastContext.Provider>
      )
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CxToastHeader ref={ref}>Test</CxToastHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxToastContext.Provider value={{ setVisible: vi.fn() }}>
          <CxToastHeader closeButton>Test</CxToastHeader>
        </CxToastContext.Provider>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
