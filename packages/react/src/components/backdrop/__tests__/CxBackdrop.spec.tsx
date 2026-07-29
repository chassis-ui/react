import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxBackdrop } from '../../../index'

describe('CxBackdrop', () => {
  describe('rendering', () => {
    test('renders nothing when not visible', () => {
      const { container } = render(<CxBackdrop>Test</CxBackdrop>)
      expect(container).toBeEmptyDOMElement()
    })

    test('matches the baseline markup snapshot when visible', () => {
      vi.useFakeTimers()
      const { container } = render(<CxBackdrop visible>Test</CxBackdrop>)
      vi.runAllTimers()
      expect(container).toMatchSnapshot()
      vi.useRealTimers()
    })
  })

  describe('styling props', () => {
    test('renders the modal-backdrop class by default once visible', () => {
      vi.useFakeTimers()
      render(<CxBackdrop visible>Test</CxBackdrop>)
      vi.runAllTimers()
      expect(screen.getByText('Test')).toHaveClass('modal-backdrop')
      vi.useRealTimers()
    })

    test('applies a custom className', () => {
      vi.useFakeTimers()
      render(
        <CxBackdrop className="bazinga" visible>
          Test
        </CxBackdrop>
      )
      vi.runAllTimers()
      expect(screen.getByText('Test')).toHaveClass('bazinga')
      vi.useRealTimers()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying div once visible', () => {
      const ref = React.createRef<HTMLDivElement>()
      vi.useFakeTimers()
      render(
        <CxBackdrop ref={ref} visible>
          Test
        </CxBackdrop>
      )
      vi.runAllTimers()
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      vi.useRealTimers()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      vi.useFakeTimers()
      const { container } = render(<CxBackdrop visible>Test</CxBackdrop>)
      vi.runAllTimers()
      vi.useRealTimers()
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
